from django.contrib.auth.decorators import login_required
from splunkdj.decorators.render import render_to

@render_to('helloworld:helloworlddj.html')
@login_required
def home(request):
    return {
        "message": "Hello World Django + JS",
        "app_name": "helloworld"
    }
