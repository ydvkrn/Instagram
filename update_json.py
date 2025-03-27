import json
import requests

# 🔗 JSON डेटा का सोर्स URL
json_url = "http://newsagency.lovestoblog.com/profiles.json"
local_file = "profiles.json"

# 📌 पुराना JSON लोड करें (अगर फाइल खाली है तो [] से स्टार्ट करें)
try:
    with open(local_file, "r", encoding="utf-8") as file:
        old_data = json.load(file)
except (FileNotFoundError, json.JSONDecodeError):
    old_data = []

# 🔄 नया JSON लोड करें
response = requests.get(json_url)
if response.status_code == 200:
    new_data = response.json()
    
    # ✅ नया डेटा जोड़ें (duplicate हटाने के लिए)
    merged_data = old_data + [item for item in new_data if item not in old_data]

    # 📝 अपडेटेड JSON को सेव करें
    with open(local_file, "w", encoding="utf-8") as file:
        json.dump(merged_data, file, indent=4)

    print("✅ JSON अपडेट हो गया!")
else:
    print("❌ JSON लोड करने में समस्या आई!")
