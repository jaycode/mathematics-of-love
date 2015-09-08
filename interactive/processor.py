import pdb

def process(compatibilities, goal='top-1'):
  values = re.findall('[0-9]+|%', goal)
  top_x = values[0]
  percent = values[1] == '%'
  

# Checks if given compatibility_scores is acceptable(i.e. within the top x percent / number of
# everyone, if 0 then only take the top one).
def is_acceptable(compatibility_score, all_compatibility_scores, top_x = 1, percent = False):
  if (percent):
    min_accepted = sorted(all_compatibility_scores)[-int(round(len(all_compatibility_scores) * float(top_x) / 100))]
  else:
    min_accepted = sorted(all_compatibility_scores)[-top_x]
  return (compatibility_score >= min_accepted)

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

# top_x: Float, showing the top x percent or #, depending on percent.
def rejection_test(compatibility_scores, top_x = 1, percent = False):
  s = []
  # If I rejected n% of people, then find the next person who is better than the rejected ones,
  # do I end up with person with max compatibility?
  # Then make that into a True/False table.
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

# Testing if function rejection_test works as expected.
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

test_is_acceptable()
test_rejection_test()