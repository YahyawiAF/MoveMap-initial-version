# pip install sparqlwrapper
# https://rdflib.github.io/sparqlwrapper/

import sys
from SPARQLWrapper import SPARQLWrapper, JSON

endpoint_url = "https://query.wikidata.org/sparql"

query = """#City and town info

SELECT 
  ?item
(MAX(?itemLabel) AS ?city_name)
(MAX(?fips_code_) AS ?fips_code)
(MAX(?countyLabel_) AS ?county )
(MAX(?stateLabel_) AS ?state )

(MAX(?population_) AS ?population)
(MAX(?population_date_) AS ?population_date)
(MAX(?population_methodLabel) AS ?population_method)
(MAX(?area_) AS ?area_sq_km)
(MAX(?area_date_) AS ?area_date )
(MAX(?coordinates_) AS ?coordinates) 
(MAX(?lat) AS ?latitude) 
(MAX(?lon) AS ?longitude) 
(MAX(?elevation_) AS ?elevation )
(MAX(?website_) AS ?website )
(MAX(?climateLabel_) AS ?climate_label )
(MAX(?nickname_) AS ?nickname)
(MAX(?gmaps_id_) AS ?gmaps_id )
(MAX(?open_street_map_id_) AS ?open_street_map_id)
(MAX(?open_weather_map_id_) AS ?open_weather_map_id)
(MAX(?facebook_places_id_) AS ?facebook_places_id)
(MAX(?youtube_id_) AS ?youtube_id)
(MAX(?twitter_user_id_) AS ?twitter_user_id)
(MAX(?subreddit_id_) AS ?subreddit_id)
(MAX(?image_) AS ?image)
(MAX(?flag_image_) AS ?flag_image)
(MAX(?quora_topic_id_) as ?quora_topic_id)
WHERE 
{
  ?item wdt:P131 ?county_ . #  county
  ?county_ wdt:P131 ?state_ . # state
  {?county_ p:P31/ps:P31/wdt:P279* wd:Q28575 .} # the county is an instance or subclass of county
  UNION {?county_ p:P31/ps:P31/wdt:P279* wd:Q13410524 .} # or parish (louisiana)
  UNION {?county_ p:P31/ps:P31/wdt:P279* wd:Q13410522 .} # or borough of alaska
  ?state_ wdt:P31 wd:Q35657 . # check that the administrative district of the county is a US state
  { ?item p:P31/ps:P31/wdt:P279* wd:Q1093829 .} # cities
  UNION { ?item p:P31/ps:P31/wdt:P279* wd:Q15127012 .} # towns
  UNION { ?item p:P31/ps:P31/wdt:P279* wd:Q4946305 .} # boroughs
############ uncomment out the next 2 lines for hawaii
  UNION { ?item p:P31/ps:P31/wdt:P279* wd:Q498162 .} # census designated places (use this only for Hawaii)
  {?county_ wdt:P131 wd:Q782 .} # the county is in hawaii
############
  
  ### assign variables
  OPTIONAL {?item wdt:P1449 ?nickname_} . # nickname
  OPTIONAL {?item wdt:P571 ?inception_} . # inception
  OPTIONAL {?item wdt:P1449 ?nickname_} . # nickname
  OPTIONAL {?item wdt:P625 ?coordinates_} . # coordinates
  OPTIONAL {
    ?item p:P625 ?coordinate.
    ?coordinate ps:P625 ?coord.
    ?coordinate psv:P625 ?coordinate_node.
    ?coordinate_node wikibase:geoLongitude ?lon.
    ?coordinate_node wikibase:geoLatitude ?lat.
  }
  OPTIONAL {?item wdt:P2044 ?elevation_} . # elevation
  OPTIONAL {?item wdt:P856 ?website_} . # website
  OPTIONAL {?item wdt:P2564 ?climate_} . # climate
  OPTIONAL {?item wdt:P3749 ?gmaps_id_} . # gmaps_id
  OPTIONAL {?item wdt:P402 ?open_street_map_id_} . # open_street_map_id
  OPTIONAL {?item wdt:P1997 ?facebook_places_id_} . # facebook_places_id
  OPTIONAL {?item wdt:P7197 ?open_weather_map_id_} . # open_weather_map_id
  OPTIONAL {?item wdt:P774 ?fips_code_} . # fips_code
  OPTIONAL {?item wdt:P2397 ?youtube_id_} . # youtube_id
  OPTIONAL {?item wdt:P2002 ?twitter_user_id_} . # twitter_user_id
  OPTIONAL {?item wdt:P3984 ?subreddit_id_} . # subreddit_id
  OPTIONAL {?item wdt:P3417 ?quora_topic_id_} . # quora_topic_id
  OPTIONAL {?item wdt:P18 ?image_} . # image
  OPTIONAL {?item wdt:P163 ?flag_image_} . # flag_image
 
  OPTIONAL {?item p:P1082 ?population_statement.
    ?population_statement ps:P1082 ?population_.
    ?population_statement pq:P585 ?population_date_.
    OPTIONAL {?population_statement pq:P459 ?population_method_.}
  }
  OPTIONAL {
    ?item p:P2046 ?area_statement.
    ?area_statement ps:P2046 ?area_.
    ?area_statement pq:P585 ?area_date_.
  }
  
  OPTIONAL {
    ?item p:P625 ?coordinate_statement.
    ?coordinate_statement ps:P2046 ?area_.
    ?area_statement pq:P585 ?area_date_.
  }
  
  ### filters
  FILTER NOT EXISTS {
    ?item p:P1082/pq:P585 ?population_date_2 .
    FILTER (?population_date_2 > ?population_date_)
  }
  
  
  FILTER NOT EXISTS {
    ?item p:P2046/pq:P585 ?area_date_2 .
    FILTER (
      ?area_date_2 > ?area_date_ 
    )
  }
  

############ uncomment out the next 2 lines for hawaii
  FILTER(?population_ > "0"^^xsd:decimal) # this helps filter out census designated places that do not have a population
  FILTER(?item != wd:Q18094) # we filter out honolulu because it is captured in the other version (it is considered a city not a census designated place)
#############  

#  UNION {?county_ wdt:P131 wd:Q797 .} # the county is in alaska
#  ?item wdt:P131 wd:Q113029 . # city is in boulder county


  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". 
                          ?item rdfs:label ?itemLabel .
                          ?population_ rdfs:label ?population_methodLabel .
                          ?county_ rdfs:label ?countyLabel_ .
                          ?state_ rdfs:label  ?stateLabel_ .
                          ?climate_ rdfs:label ?climateLabel_ .    
                         } # Helps get the label in your language, if not, then en language
}

GROUP BY
  ?item"""

query_county = """
#City and town info

SELECT 
  ?item
(MAX(?itemLabel) AS ?county_name)
(MAX(?fips_code_) AS ?fips_code)
(MAX(?stateLabel_) AS ?state )

(MAX(?population_) AS ?population)
(MAX(?population_date_) AS ?population_date)
(MAX(?population_methodLabel) AS ?population_method)
(MAX(?area_) AS ?area_sq_km)
(MAX(?area_date_) AS ?area_date )
(MAX(?coordinates_) AS ?coordinates) 
(MAX(?lat) AS ?latitude) 
(MAX(?lon) AS ?longitude) 
(MAX(?elevation_) AS ?elevation )
(MAX(?website_) AS ?website )
(MAX(?climateLabel_) AS ?climate_label )
(MAX(?nickname_) AS ?nickname)
(MAX(?gmaps_id_) AS ?gmaps_id )
(MAX(?open_street_map_id_) AS ?open_street_map_id)
(MAX(?open_weather_map_id_) AS ?open_weather_map_id)
(MAX(?facebook_places_id_) AS ?facebook_places_id)
(MAX(?youtube_id_) AS ?youtube_id)
(MAX(?twitter_user_id_) AS ?twitter_user_id)
(MAX(?subreddit_id_) AS ?subreddit_id)
(MAX(?image_) AS ?image)
(MAX(?flag_image_) AS ?flag_image)
(MAX(?quora_topic_id_) as ?quora_topic_id)
WHERE 
{
  ?item wdt:P131 ?state_ . #  item is a county, state is the state to which it belongs
  {?item p:P31/ps:P31/wdt:P279* wd:Q28575 .} # the item is an instance or subclass of county
  UNION {?item p:P31/ps:P31/wdt:P279* wd:Q13410524 .} # or parish (louisiana)
  UNION {?item p:P31/ps:P31/wdt:P279* wd:Q13410522 .} # or borough of alaska

  ?state_ wdt:P31 wd:Q35657 . # check that the administrative district of the county is a US state
  
  ### assign variables
  OPTIONAL {?item wdt:P1449 ?nickname_} . # nickname
  OPTIONAL {?item wdt:P571 ?inception_} . # inception
  OPTIONAL {?item wdt:P1449 ?nickname_} . # nickname
  OPTIONAL {?item wdt:P625 ?coordinates_} . # coordinates
  OPTIONAL {
    ?item p:P625 ?coordinate.
    ?coordinate ps:P625 ?coord.
    ?coordinate psv:P625 ?coordinate_node.
    ?coordinate_node wikibase:geoLongitude ?lon.
    ?coordinate_node wikibase:geoLatitude ?lat.
  }
  OPTIONAL {?item wdt:P2044 ?elevation_} . # elevation
  OPTIONAL {?item wdt:P856 ?website_} . # website
  OPTIONAL {?item wdt:P2564 ?climate_} . # climate
  OPTIONAL {?item wdt:P3749 ?gmaps_id_} . # gmaps_id
  OPTIONAL {?item wdt:P402 ?open_street_map_id_} . # open_street_map_id
  OPTIONAL {?item wdt:P1997 ?facebook_places_id_} . # facebook_places_id
  OPTIONAL {?item wdt:P7197 ?open_weather_map_id_} . # open_weather_map_id
  OPTIONAL {?item wdt:P882 ?fips_code_} . # fips_code
  OPTIONAL {?item wdt:P2397 ?youtube_id_} . # youtube_id
  OPTIONAL {?item wdt:P2002 ?twitter_user_id_} . # twitter_user_id
  OPTIONAL {?item wdt:P3984 ?subreddit_id_} . # subreddit_id
  OPTIONAL {?item wdt:P3417 ?quora_topic_id_} . # quora_topic_id
  OPTIONAL {?item wdt:P18 ?image_} . # image
  OPTIONAL {?item wdt:P163 ?flag_image_} . # flag_image
 
  OPTIONAL {?item p:P1082 ?population_statement.
    ?population_statement ps:P1082 ?population_.
    ?population_statement pq:P585 ?population_date_.
    OPTIONAL {?population_statement pq:P459 ?population_method_.}
  }
  OPTIONAL {
    ?item p:P2046 ?area_statement.
    ?area_statement ps:P2046 ?area_.
    ?area_statement pq:P585 ?area_date_.
  }
  
  OPTIONAL {
    ?item p:P625 ?coordinate_statement.
    ?coordinate_statement ps:P2046 ?area_.
    ?area_statement pq:P585 ?area_date_.
  }
  
  ### filters
  FILTER NOT EXISTS {
    ?item p:P1082/pq:P585 ?population_date_2 .
    FILTER (?population_date_2 > ?population_date_)
  }
  
  
  FILTER NOT EXISTS {
    ?item p:P2046/pq:P585 ?area_date_2 .
    FILTER (
      ?area_date_2 > ?area_date_ 
    )
  }
 

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". 
                          ?item rdfs:label ?itemLabel .
                          ?population_method_ rdfs:label ?population_methodLabel .
                          ?county_ rdfs:label ?countyLabel_ .
                          ?state_ rdfs:label  ?stateLabel_ .
                          ?climate_ rdfs:label ?climateLabel_ .    
                         } # Helps get the label in your language, if not, then en language
}

GROUP BY
  ?item
"""

def get_results(endpoint_url, query):
    user_agent = "WDQS-example Python/%s.%s" % (sys.version_info[0], sys.version_info[1])
    # TODO adjust user agent; see https://w.wiki/CX6
    sparql = SPARQLWrapper(endpoint_url, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    return sparql.query().convert()


results = get_results(endpoint_url, query)

for result in results["results"]["bindings"]:
    print(result)
