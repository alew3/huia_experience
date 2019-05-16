import pathlib

path = pathlib.Path('./training_data/images/')

for file in path.iterdir():
    print(file.name)

