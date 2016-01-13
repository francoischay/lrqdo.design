var navManager = {
  h: window.history,

  init: function(){
    this.setNavListeners();
    this.goto(window.location.hash);
  },

  getCurrentState: function(){
    return this.h.state;
  },

  setNavListeners: function(){
    $("body").on("click", "nav a, .hub a", {scope: this}, function(_e){
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
    var state = {dest: _page}
    this.h.pushState(state, _page, _page);
    this.loadPage(_page.replace("#",""))
  },

  loadPage: function(_hash) {
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
