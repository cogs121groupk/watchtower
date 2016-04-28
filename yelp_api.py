from yelp.client import Client
from yelp.oauth1_authenticator import Oauth1Authenticator

auth = Oauth1Authenticator(
    consumer_key="gk_7kDVoNDz17dG2iTtUQw",
    consumer_secret="sLOaP331PfDzOa8cHJ0Goekf7GI",
    token="fXfBgnF6rVjjetUWFK0wFREgZifsO9cj",
    token_secret="wdvTU3eDE1YW5QgOtAzcdDmT7pA"
)

client = Client(auth)

params = {
	'term', 'nightclub',
	'limit', 500
}

response = client.search_by_bounding_box(
    33.313021,
    -117.426703,
    32.52816,
    -116.926104,
	**params
)

