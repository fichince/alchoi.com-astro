require 'csv'
require 'yaml'
require 'slugify'

CSV.open("readwise-data.csv", "r") do |csv|

  # drop header row
  csv.shift

  result = {}

  csv.each do |row|
    text = row[0]
    title = row[1]
    author = row[2]
    tags = row[6]

    next if tags&.include?('discard')

    primary_title = title.split(':')[0]

    slug = primary_title.slugify

    if result.has_key?(slug)
      data = result[slug]
    else
      data = {
        title: title,
        author: author,
        quotes: []
      }
      result[slug] = data
    end

    data[:quotes] << text
  end

  result.each do |slug, data|
    filename = "#{slug}.md"

    data = data.map { |k, v| [k.to_s, v] }.to_h
    yaml = YAML.dump(data)

    yaml << "---\n"

    File.write("tmp/#{filename}", yaml)

  end
end