#!/bin/bash

curl -d \
'{"captableAddress": "0x0ebe76e4aa77514c6cfa9e40435c77febf94ebfc", "soldByAddress": "0xb415f84064f46732e179aa0e43059533f487243c", "price": 123, "numberOfShares": 50}' \
-H "Content-Type: application/json" \
-X POST \
http://localhost:3000/api/sell-shares