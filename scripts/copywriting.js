$(function() {

  var CopyWriting = {
    init: function(){
      this.loadData();
    },

    loadData: function(){
      $.getJSON("https://sheetsu.com/apis/ec6cd14f", function(_data){
        //console.table(_data.result)
        links = {};
        situations = {};
        emotions = {};

        var situationsSelect = "<select>";
        var emotionsSelect = "<select>";

        var data = $.map(_data.result, function(_val, _i){
          var s = [];
          if(situations[_val.Situation]){
            s = situations[_val.Situation].slice(0);
          }
          else{
            situationsSelect += "<option value='"+_val.Situation+"'>"+_val.Situation+"</option>";
          }
          
          s.push(_i)
          situations[_val.Situation] = s;

          var e = [];
          if(emotions[_val.Emotion]){
            s = emotions[_val.Emotion].slice(0);
          }
          else{
            emotionsSelect += "<option value='"+_val.Emotion+"'>"+_val.Emotion+"</option>";
          }

          e.push(_i)
          emotions[_val.Emotion] = e;
        })

        situationsSelect += "</select>";
        emotionsSelect += "</select>";

        $("#main").append(situationsSelect).append(emotionsSelect);
      })
    }
  }

  CopyWriting.init();
})
