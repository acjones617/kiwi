jQuery.fn.getPath = ->
  throw "Requires one element."  unless @length is 1
  path = undefined
  node = this
  if node[0].getAttribute("id") #return id only if it exists
    id = node[0].getAttribute("id")
    return "#" + id
  addClass = true #to make sure class selector fires once at maximum
  while node
    realNode = node[0]
    break  unless realNode.localName #something's wrong with the selected element
    name = realNode.localName.toLowerCase()
    parent = node.parent()
    siblings = parent.children(name)
    if realNode.getAttribute("class") and addClass and realNode.getAttribute("class") isnt "" and realNode.getAttribute("class") isnt "__kiwi"
      
      # name+= '.' + realNode.getAttribute('class');
      name += "." + realNode.getAttribute("class").split(" ").join(".")
      
      # console.log('added class: ', name);
      addClass = false
    
    # if (siblings.length > 1) {
    #   name += ':eq(' + siblings.index(realNode) + ')';
    # }
    path = name + ((if path then ">" + path else ""))
    node = parent
  if $(path) isnt $(this)
    index = $(path).index($(this))
    path += ":eq(" + index + ")"
  path
