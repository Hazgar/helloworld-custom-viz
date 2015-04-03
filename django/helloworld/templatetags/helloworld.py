from django import template
from splunkdj.templatetags.tagutils import component_context

register = template.Library()

@register.inclusion_tag('splunkdj:components/component.html', takes_context=True)
def helloworld(context, id, *args, **kwargs):
    return component_context(
        context,
        "helloworld",
        id,
        "view",
        "helloworld/components/helloworld/helloworld",
        kwargs
    )
