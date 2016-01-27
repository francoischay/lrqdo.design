var navManager = {
  h: window.history,

  init: function(){
    console.log("init")
    this.setNavListeners();
    this.goto(window.location.hash);
  },

  getCurrentState: function(){
    return this.h.state;
  },

  setNavListeners: function(){
    console.log("setNavListeners")
    $("body").on("click", ".nav a, .hub a", {scope: this}, function(_e){
      _e.preventDefault();
      var dest = _e.currentTarget.getAttribute("href");
      _e.data.scope.goto(dest);
    })
    $(window).on("popstate", {scope: this}, function(_e) {
      console.log(window.location)
//      _e.data.scope.goto(window.location.hash.replace("#", ""));
    });
  },

  goto: function(_page){
    console.log("goto("+_page+")");
    var URLelmts = _page.split("/");
    var page = URLelmts[0];
    var hash = _.toArray(URLelmts).slice(1);
        hash = hash.join("/");
    var state = {
      dest: page,
      hash: hash
    }

    this.h.pushState(state, page, page);
    this.loadPage(page.replace("#",""))
  },

  loadPage: function(_hash) {
    console.log("loadPage")
    var content = _hash;

    if(_hash.length <= 1){
      content = "hub.html";
    }
    else{
      content += ".html"
    }

    $("#main").load(content)
  }
}
