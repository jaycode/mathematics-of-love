### Python code to get data needed for our math app.
import numpy as np
from pandas import *


def secretaryData(n):
  # rejected is number of rejected people.
  # p_of_r is the probability of success ( a.k.a. P(r) ).
  title_r = 'rejected'
  title_pr = 'p_of_r'
  rows = []
  for i in range(1,n+1):
    e = 0.0
    for j in range(i,n+1):
      if (j == 1):
        e = 0.0
      else:
        e = float(e + (1 / (float(j) - 1)))
    rows.append({title_r: i, title_pr: round(((float(i) - 1) / float(n)) * e, 3)})

  return(rows)

def getIntro():
  partners = secretaryData(100)
  return {'partners': partners}

def run():
  return {'test': 'json'}

def main():
  print getIntro()

if __name__ == '__main__':
  main()