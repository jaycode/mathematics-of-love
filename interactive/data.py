### Python code to get data needed for our math app.
import numpy as np
from pandas import *
import random

# Random seed for testing purposes.
np.random.seed(42)
random.seed(42)

# Generates probability data calculated using Optimal Stopping Theory.
def probability_data(n):
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

def get_intro():
  partners = probability_data(100)
  return {'partners': partners}

# Generates dataset given start age (a1), end age (a2),
# min and max potential partners met per year (p1 and p2),
# and number of lifetimes (l). 
def get_compatibilities(a1=18, a2=24, p1=0, p2=8, l=10000):
  compatibilities = []
  a1 = int(a1)
  a2 = int(a2)
  p1 = int(p1)
  p2 = int(p2)
  l = int(l)
  
  for lt in range(1, l+1):
    # Number of candidates met per year should range between p1 and p2.
    yearly_num_candidates = random.sample(range(p1, p2), (a2-a1))
    for year, num_candidates in enumerate(yearly_num_candidates):
      # Compatibility scores of candidates should follow a normal distribution.
      scores = np.random.normal(size=num_candidates)
      for score in scores:
        compatibilities.append({
          'lifetime': lt,
          'candidate_score': round(score,3),
          'candidate_age_met': a1+year
        })
  return compatibilities

def get(a1=18, a2=24, p1=0, p2=8, l=10000):
  compatibilities = get_compatibilities(a1, a2, p1, p2, l)
  return {'compatibilities': compatibilities}

def main():
  compatibilities = get_compatibilities()
  print len(compatibilities)

if __name__ == '__main__':
  main()