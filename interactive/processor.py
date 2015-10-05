import pdb
import numpy as np
from itertools import groupby

# Generates probability data calculated using Optimal Stopping Theory.
def compute_ost_theory(n):
  rows = np.zeros(n)
  for i in range(0,n):
    # Python's base 0 made it much complicated.
    index = i+1

    e_r = np.arange((n+1)-index).astype(float)
    e_r = 1 / (e_r + index - 1)
    e_r[np.isinf(e_r)] = 0
    e = np.sum(e_r)
    val = ((float(index) - 1) / float(n)) * e
    if val < 0:
      val = 0
    rows[i] = val
  return(np.round(rows, 3))

# Processes the compatibilities, calculating their success rates.
def process(compatibilities, lifetimes=10000, goal='top-1'):
  import re
  if goal == 'theory':
    # Output based on formula instead of data.
    success_rates = compute_ost_theory(100)
  else:
    title_pr = 'p_of_r'
    values = re.findall('[0-9]+|%', goal)
    top_x = values[0]
    percent = (False if len(values) == 1 else values[1] == '%')

    groups = groupby(compatibilities, lambda x: x.pop('lifetime'))

    successes = np.zeros([100, lifetimes])

    for k, g in groups:
      l_compats = [];
      for v in g:
        l_compats.append(v['candidate_score'])
      row = rejection_test(l_compats, top_x, percent)
      successes[:,k-1] = row
    success_rates = successes.sum(1) / lifetimes
  return success_rates

# Tests process method.
def test_process():
  import data
  process(data.get_compatibilities(), 10000, 'top-1')
  process(data.get_compatibilities(), 10000, 'top-10%25')
  process(data.get_compatibilities(), 10000, 'top-15%25')
  process(data.get_compatibilities(), 10000, 'theory')

# Checks if given compatibility_scores is acceptable(i.e. within the top x percent / number of
# everyone, if 0 then only take the top one).
def is_acceptable(compatibility_score, all_compatibility_scores, top_x = 1, percent = False):
  if (percent):
    min_accepted = sorted(all_compatibility_scores)[-int(round(len(all_compatibility_scores) * float(top_x) / 100))]
  else:
    min_accepted = sorted(all_compatibility_scores)[-int(top_x)]
  return (compatibility_score >= min_accepted)

# Tests is_acceptable method.
def test_is_acceptable():
  compats = sorted(range(1, 101,1))
  result1 = is_acceptable(100, compats)
  result2 = is_acceptable(95, compats)
  result3 = is_acceptable(96, compats, 5, True)
  result4 = is_acceptable(95, compats, 5, True)
  
  # What if the values aren't integers
  compats = sorted(range(1, 82, 1))
  result5 = is_acceptable(81, compats)
  result6 = is_acceptable(80, compats)
  result7 = is_acceptable(78, compats, 5, True)
  result8 = is_acceptable(77, compats, 5, True)

  compatibility_scores = [3, 5, 4, 8, 9, 5, 10, 1, 10, 3]
  result9 = is_acceptable(10, compatibility_scores, 1, False)

  assert (
    result1 == True and
    result2 == False and
    result3 == True and
    result4 == False and
    result5 == True and
    result6 == False and
    result7 == True and
    result8 == False and
    result9 == True
  ), "Assertion Failed"

# If I rejected n% of people, then find the next person who is better than the rejected ones,
# do I end up with person with max compatibility?
# Then make that into a True/False table.
# top_x: Float, showing the top x percent or #, depending on percent.
def rejection_test(compatibility_scores, top_x = 1, percent = False):
  s = []
  for x in range(0, 100):
    pos = (int(round(len(compatibility_scores) * float(x) / 100)) + 1)
    if (pos > len(compatibility_scores)):
      pos = len(compatibility_scores)
    
    try:
      max_score = max(compatibility_scores[0:pos])
      found_id = (i for i,num in enumerate(compatibility_scores[pos:]) if num > max_score).next()
      pos_final = found_id + pos
      s.append(is_acceptable(compatibility_scores[pos_final], compatibility_scores, top_x, percent))
    except StopIteration:
      s.append(False)

  return(s)

# Tests rejection_test method.
def test_rejection_test():
  compatibility_scores = [3, 5, 4, 8, 9, 5, 10, 1, 10, 3]
  results = rejection_test(compatibility_scores)
  # pos 0 = at 0% rejected
  # pos 1 = at 1% rejected
  # pos 14 = at 14% rejected
  # pos 99 = at 99% rejected
  assert (
    results[0] == False and
    results[34] == False and
    results[35] == True and
    results[45] == True and
    results[85] == False and
    results[99] == False
  ), "Assertion failed"
  
  # With top x%
  compatibility_scores = [3, 5, 4, 8, 9, 5, 10, 1, 10, 3]
  results = rejection_test(compatibility_scores, 30, True)
  # pos 0 = at 0% rejected
  # pos 1 = at 1% rejected
  # pos 14 = at 14% rejected
  # pos 99 = at 99% rejected
  assert (
    results[0] == False and
    results[24] == False and
    results[25] == True and
    results[45] == True and
    results[85] == False and
    results[99] == False
  ), "Assertion failed"

# test_is_acceptable()
# test_rejection_test()
# test_process()
result = compute_ost_theory(1000)
print result