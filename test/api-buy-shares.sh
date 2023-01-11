#!/bin/bash

echo "list sell orders, should be empty"
curl localhost:3000/api/list-sell-orders -s | jq .

echo "Create sell order"
curl -d \
'{"captableAddress": "0x0ebe76e4aa77514c6cfa9e40435c77febf94ebfc", "soldByAddress": "0xb415f84064f46732e179aa0e43059533f487243c", "price": 2, "numberOfShares": 10}' \
-H "Content-Type: application/json" \
-X POST \
http://localhost:3000/api/sell-shares  -s \
| jq .

echo "list sell orders, should be one order"
curl localhost:3000/api/list-sell-orders  -s | jq .

echo "buy 20 stocs"
curl -d \
'{"transactionID": 1, "buyerID": "0x4f4441a36e5870018a9481fd7dab9d326f71f1fe", "amountOfStocsToBuy": 10}' \
-H "Content-Type: application/json" \
-X POST \
http://localhost:3000/api/buy-shares  -s \
| jq .

echo "list sell orders, sold should be true"
curl localhost:3000/api/list-sell-orders -s | jq .

yarn reset