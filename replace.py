search_text = "http://localhost:8080/"
replace_text = "/"
with open(r'dist/index.html', 'r') as file:
    data = file.read()
    data = data.replace(search_text, replace_text)

with open(r'dist/index.html', 'w') as file:
    file.write(data)

print("Text replaced")