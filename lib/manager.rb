# frozen_string_literal: true

require 'json'
require 'logger'
require_relative 'StaticData'

def logger
  @logger = Logger.new(STDOUT)
end
