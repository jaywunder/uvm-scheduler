SEMESTER='2017fall'
# datasource='https://giraffe.uvm.edu/~rgweb/batch/curr_enroll_spring.txt'
datasource='https://giraffe.uvm.edu/~rgweb/batch/curr_enroll_fall.txt'

if [[ ! -d out ]]; then
  mkdir out
fi

curl -s $datasource -o 'out/'$SEMESTER'.csv' > /dev/null

python3 ./main.py $SEMESTER > 'out/'$SEMESTER'_sections.md'
