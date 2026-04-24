Version 5
---------

mockup 2: Python with tests
test indicator: /python2

-[] modify the project to mock up a python interactive coding test when the test indicator is appended to the website URL
-[] make the "Task" prompt:

    - Write a Python function my_min(<int1>, <int2>, ...) that accepts a variable number of integer arguments, and returns the value of the samllest number
        - you can safely assume:
            - there is always at least 1 integer argument
            - all arguments are integers

    - here is some sample input and output
        my_min(3, 1, 4, 1, 5)  RETURNS: 1
        my_min(7, 2)           RETURNS: 2

-[] replace the terminal to be a pname named "Check against test data" where the user can see the functions expected and actual output for different inputs, with a button "Re-run tests"
e.g.
Call       | Expected output | Actual output  |  Pass/Fail
my_min(-1)  | -1               | -1               | Pass (green color / tick)
my_min(0)  | 0               | 0               | Pass (green color / tick)
my_min(1)  | 1               | 1               | Pass (green color / tick)
my_min(1, 2)  | 1               | 0               | Fail (red color / tick)
my_min(2, 1)  | 1               | 0               | Fail (red color / tick)


-[] show the following for the user's code in the file editor, for a file name "my_functions.py":

```python
def my_min(*args):
    smallest = 0

    for item in args:
        if item < smallest:
            smallest = item

    return smallest
```

