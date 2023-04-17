# frozen_string_literal: true

require_relative 'lib/manager'

def docker_compose_ps
  JSON.parse(`docker-compose ps --format=json`)
end

def docker_compose_inspect(name)
  `docker inspect -f='json' #{name}`
end

def url_by(name)
  json = JSON.parse(docker_compose_inspect(name))
  ip = json[0]['NetworkSettings']['Networks']['onlyoffice-api-plugin-testing_default']['IPAddress']
  "http://#{ip}"
end

# @return [String] ip
def nginx_url(containers = docker_compose_ps)
  containers.each_with_index do |container, index|
    next unless container['Name'].include? "#{StaticData::PROJECT_NAME}-nginx"

    return url_by(containers[index]['Name'])
  end
  logger.error 'nginx service not found'
end

# p ip_nginx

def plugins_url_to_config_array
  ip = nginx_url
  array = Dir["#{StaticData::PLUGINS_FOLDER}/*"]
  logger.info ip
  logger.info array
  array.map { |path| "#{ip}/#{File.basename(path)}/config.json" }
end

def write_json(array = plugins_url_to_config_array)
  File.open('tmp/local.json', 'r+') do |file|
    json = file.read
    json = JSON.parse(json)
    json['plugins'] = { pluginsData: array }
    file.rewind
    file.write JSON.pretty_generate(json)
    file.flush
  end
end

# docker compose cp
def docker_compose_cp(direction, service, src_path, dest_path)
  case direction
  when 'from'
    # logger.info service
    # logger.info src_path
    # logger.info dest_path
    system("docker compose cp #{service}:#{src_path} #{dest_path}")
  when 'to'
    # logger.info service
    # logger.info dest_path
    # logger.info src_path
    system("docker compose cp #{src_path} #{service}:#{dest_path}")
  else
    logger.error 'Filed direction'
  end
end

docker_compose_cp('from', StaticData::SERVER_NAME, "#{StaticData::EXAMPLES_PATH}/local.json", './tmp')
write_json
docker_compose_cp('to', StaticData::SERVER_NAME, './tmp/local.json', StaticData::EXAMPLES_PATH)

system("docker compose exec -T #{StaticData::SERVER_NAME} supervisorctl restart ds:example")
