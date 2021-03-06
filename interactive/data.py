### Python code to get data needed for our math app.
import numpy as np
import random
import os.path
try:
  import ujson
except:
  import json as ujson
import pdb
import urllib

# Random seed for testing purposes.
np.random.seed(42)
random.seed(42)

# Get data for intro visualization.
def get_intro():
  # processor is imported in functions to avoid deadlock when running
  # test_process in processor.py since that imports this module.
  import processor

  partners = processor.compute_ost_theory(100)
  return {'partners': list(partners)}

def _get_compatibilities(a1, a2, p1, p2, l):
  compatibilities = []
  for lt in range(1, l+1):
    # Number of candidates met per year should range between p1 and p2.
    yearly_num_candidates = []
    for a in range(0, (a2-a1)):
      yearly_num_candidates.append(random.choice(range(p1, p2)))
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

# Generates dataset given start age (a1), end age (a2),
# min and max potential partners met per year (p1 and p2),
# and number of lifetimes (l). 
def get_compatibilities(a1=18, a2=24, p1=0, p2=8, l=10000):
  a1 = int(a1)
  a2 = int(a2)
  p1 = int(p1)
  p2 = int(p2)
  l = int(l)
  filename = "cached_data/a1%ia2%ip1%ip2%il%i.json" % (a1, a2, p1, p2, l)
  if not os.path.exists('cached_data'):
    try:
      os.makedirs('cached_data')
    except OSError as e:
      compatibilities = _get_compatibilities(a1, a2, p1, p2, l)
      return compatibilities
  if os.path.isfile(filename):
    with open(filename) as fhandler:    
      compatibilities = ujson.load(fhandler)
  else:
    compatibilities = _get_compatibilities(a1, a2, p1, p2, l)
    with open(filename, 'w') as fhandler:
      ujson.dump(compatibilities, fhandler)
  return compatibilities

# Get processed data based on given ages (a1 and a2), potential partners (p1 and p2),
# lifetimes (l), and goals (g).
def get_processed(a1=18, a2=24, p1=0, p2=8, l=10000, g='top-1,top-10%25,top-15%25,theory'):
  # processor is imported in functions to avoid deadlock when running
  # test_process in processor.py since that imports this module.
  import processor

  if not os.path.exists('cached_data'):
    os.makedirs('cached_data')

  processed = {}
  a1 = int(a1)
  a2 = int(a2)
  p1 = int(p1)
  p2 = int(p2)
  l = int(l)
  g = urllib.unquote(g).decode('utf8')
  goals = g.split(',')
  for goal in goals:
    filename = "cached_data/a1%ia2%ip1%ip2%il%i-%s.json" % (a1, a2, p1, p2, l, goal)
    processed_goal = []

    if os.path.isfile(filename):
      with open(filename) as fhandler:    
        processed_goal = ujson.load(fhandler)
    else:
      compatibilities = get_compatibilities(a1, a2, p1, p2, l)
      processed_goal = list(processor.process(compatibilities, lifetimes=l, goal=goal))
      with open(filename, 'w') as fhandler:
        ujson.dump(processed_goal, fhandler)
    processed[goal] = processed_goal
  return processed

# Getting the data. If p == 1 then get processed data, otherwise get experiments.
def get(a1=18, a2=24, p1=0, p2=8, l=10000, p=0, g='top-1,top-10%25,top-15%25,theory'):
  p = int(p)
  if p==1:
    processed = get_processed(a1, a2, p1, p2, l, g)
    return {'processed': processed}
  else:
    compatibilities = get_compatibilities(a1, a2, p1, p2, l)
    return {'compatibilities': compatibilities}

def main():
  compatibilities = get_compatibilities()
  print len(compatibilities)

if __name__ == '__main__':
  main()
