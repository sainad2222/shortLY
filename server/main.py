from flask import Flask, request, redirect
from flask_restful import Resource, Api, reqparse
from flask_pymongo import PyMongo
from random import choice
from string import ascii_letters, digits
from flask_cors import CORS
import os

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/shortly"

mongo = PyMongo(app)
api = Api(app)
CORS(app)
BASE = os.getenv("BASE") or "http://localhost:5000/"

db = mongo.db
mask = ascii_letters + digits

"""
POST
@params
    url: String
    slug: String(Optional)
"""


class URLPost(Resource):
    def __init__(self):
        super(URLPost, self).__init__()
        self.parser = reqparse.RequestParser()
        self.parser.add_argument("url")
        self.parser.add_argument("slug")

    def post(self):
        args = self.parser.parse_args()
        url = args["url"]
        slug = args["slug"]
        if len(url) < 5:
            return {"error": "Url is too short to be a url"}, 400
        if url[:4] != "http":
            url = "https://" + url
        if slug:
            if len(slug) < 4:
                return {"error": "Short name should be atleast 4 chars"}, 400
            # check if url with given slug already exists
            url_exists = db.shortly.find_one({"slug": slug})
            if url_exists:
                return {"error": "Url with that short name already exists"}, 400
        else:
            # generate random slug
            slug = ""
            for i in range(4):
                slug += choice(mask)
        try:
            db.shortly.insert_one({"url": url, "slug": slug})
        except Exception as e:
            print("[ERROR]", e)
            return {"error": "DB error"}, 400
        return {"message": "success", "short_url": BASE + slug}, 201


"""
GET
@params
    slug: String
"""


class URLGet(Resource):
    def get(self, slug):
        url = db.shortly.find_one({"slug": slug})
        if url:
            return redirect(url["url"])
        return {"error": "Not found"}, 404


api.add_resource(URLPost, "/")
api.add_resource(URLGet, "/<slug>")

if __name__ == "__main__":
    app.run(debug=False)
