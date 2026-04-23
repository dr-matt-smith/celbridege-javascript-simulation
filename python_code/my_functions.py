# def my_min(*args):
#     smallest = args[0]
#
#     for item in args[1:]:
#         if item < smallest:
#             smallest = item
#
#     return smallest

def my_min(*args):
    smallest = 0

    for item in args:
        if item < smallest:
            smallest = item

    return smallest


def main():
    print(my_min(7, 2))


if __name__ == "__main__":
    main()