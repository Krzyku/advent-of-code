#!/bin/bash

# Load environment variables
source .env

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <year> <day>"
    exit 1
fi

year=$1
day=$2
# current_year=$(date +'%Y')

# Year validation
if [ $year -lt 2015 ]; then
    echo "Year must be between 2015 and 2020"
    exit 1
fi

# Day validation
if [ $day -lt 1 ] || [ $day -gt 25 ]; then
    echo "Day must be between 1 and 25"
    exit 1
fi

# Add leading zero to day
day_with_leading_zero=$day
if [ $day -lt 10 ]; then
    day_with_leading_zero="0$day"
fi

solution_path="solutions/$year/$day_with_leading_zero"
solution_file="$solution_path/main.ts"

# Create directory
mkdir -p $solution_path

# Copy template file if it doesn't exist
if [ ! -f $solution_file ]; then
    cp template.ts $solution_file
fi

# Fetch input if it doesn't exist
if [ ! -f $solution_path/input.txt ]; then
    curl -s https://adventofcode.com/$year/day/$day/input -H "Cookie: session=$AOC_SESSION" > $solution_path/input.txt
fi

# Run solution
bun --watch $solution_file
