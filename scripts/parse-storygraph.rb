require 'csv'
require 'net/http'

CSV.open("storygraph.csv", "r") do |csv|

  # drop header row
  csv.shift

  result = []

  csv.each do |row|
    title = row[0]
    author = row[1]
    date = row[7]
    if date.nil? || date.empty? then
      date = row[6]
    end
    date = date.gsub(/\//, '-')
    puts "#{title} [#{row[7]}] [#{row[6]}]"
    rating = row[17]
    review = row[18]

    next if review.nil? || review.empty?

    result << {
      title: title,
      author: author,
      rating: rating,
      review: review,
      date: date
    }
  end

  result.sort! do |a, b|
    #puts "sorting [#{a[:title]}][#{a[:date]}] and [#{b[:title]}][#{b[:date]}]"
    Date.parse(a[:date]) <=> Date.parse(b[:date])
  end

  out = ''

  result.each do |item|

    out << "### [_#{item[:title]}_]() <small>by #{item[:author]}</small>"
    out << "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small>#{item[:date]}</small>\n\n"
    out << "<span><sl-rating value=\"#{item[:rating]}\" readonly /></span> \n\n"
    out << item[:review] << "\n\n"

  end

  File.write("storygraph.md", out)

end
