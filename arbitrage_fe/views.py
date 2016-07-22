
from django.shortcuts import render_to_response
from django.http import HttpResponse
from settings import db
import json
from bson import ObjectId

def home(request):
    scripts = db.Calculators.find()
    all_scripts = [{'name': s['name'], 'code': s['code'], 'id': s['_id']} for s in scripts]
    return render_to_response('home.html', {'scripts': all_scripts})

def save_script(request):
    if request.is_ajax() and request.method == "POST":
        params = json.loads(request.body)
        if params['id']:
            db.Calculators.update({'_id': ObjectId(params['id'])}, {'$set': {'code': params['code'], 'name': params['name']}})
        else:
            db.Calculators.insert({'code': params['code'], 'name': params['name']})
    return HttpResponse()

def remove_script(request):
    if request.is_ajax() and request.method == "POST":
        params = json.loads(request.body)
        if params['id']:
            db.Calculators.remove({'_id': ObjectId(params['id'])})
    return HttpResponse()