require 'csv'
require 'net/http'

CSV.open("reviews.csv", "r") do |csv|

  # drop header row
  csv.shift

  result = []

  csv.each do |row|
    title = row[1]
    link = row[3]
    rating = row[4]
    review = row[6]
    date = row[8]

    response = Net::HTTP.get_response(URI(link))

    redirect = response['Location']
    link = redirect.sub(/\/fi_chince/, '')

    result << {
      title: title,
      link: link,
      rating: rating,
      review: review,
      date: date
    }
  end

  result.sort! do |a, b|
    Date.parse(a[:date]) <=> Date.parse(b[:date])
  end

  out = ''

  result.each do |item|

    out << "### [_#{item[:title]}_](#{item[:link]})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small>#{item[:date]}</small>\n\n"
    out << "<span><sl-rating value=\"#{item[:rating]}\" readonly /></span> \n\n"
    out << item[:review] << "\n\n"

  end

  File.write("letterboxd.md", out)

end
