$(function() {

  var CopyWriting = {
    init: function(){
      this.loadData();

      console.log(navManager.h.state)

      $("body")
        .on("change", "[name=situations]", {scope: this}, function(_e){
          _e.data.scope.onSelectSituation(_e.target.value);
        })
        .on("change", "[name=emotions]", {scope: this}, function(_e){
          _e.data.scope.onSelectEmotion(_e);
        })
        .on("click", ".situation", {scope: this}, function(_e){
          _e.data.scope.selectSituation($(_e.currentTarget).attr("data-situation"));
        })
        .on("click", ".emotion", {scope: this}, function(_e){
          _e.data.scope.selectEmotion($(_e.currentTarget).attr("data-emotion"));
        })
        .on("click", ".pill-situation", {scope: this}, function(_e){
          _e.data.scope.onSelectSituation();
        })
        .on("click", ".pill-emotion", {scope: this}, function(_e){
          _e.data.scope.onSelectEmotion();
        })
    },

    setData: function(_data){
      this.data = _data;
    },

    setCurrentSituations: function(_data){
      this.currentSituations = _data;
    },

    loadData: function(){
      $.getJSON("https://sheetsu.com/apis/v1.0/e83e7a636b9e", $.proxy(function(_data){
        this.setData(_data);
        links = {};
        situations = {};
        emotions = {};

        var situationsSelect = "<select name='situations'>";
            situationsSelect += "<option>Select a situation</option>";
        var situationsHub = "<div class='row'>";

        var data = $.map(_data, function(_val, _i){
          var s = [];
          console.log(_val)
          console.log(situations[_val.SituationLabel])
          if(situations[_val.SituationLabel]){
            s = situations[_val.SituationLabel].slice(0);
            console.log(s)
          }
          else{
            situationsSelect += "<option value='"+_val.SituationLabel+"'>"+_val.Situation+"</option>";
            situationsHub += "<div class='col-md-12 situation' data-situation='" + _val.SituationLabel + "'><h2>" + _val.Situation + "</h2></div>";
          }
          s.push(_i)
          situations[_val.SituationLabel] = s;
        })

        situationsSelect += "</select>";
        situationsHub += "</div>";

        $(".selects").append(situationsSelect);
        $(".content").html(situationsHub);

        if(navManager.h.state.hash){
          var state = navManager.h.state;
          navManager.h.pushState(state, "", state.dest+"/"+state.hash);
          var elmts = state.hash.split("/");
          this.selectSituation(elmts[0]);
        }
      }, this))
    },

    selectSituation: function(_situation){
      $("[name=situations] option[value='"+_situation+"']").prop("selected", true);
      $("[name=situations]").trigger("change");
    },

    selectEmotion: function(_emotion){
      $("[name=emotions] option[value='"+_emotion+"']").prop("selected", true);
      $("[name=emotions]").trigger("change");
    },

    onSelectSituation: function(_situation){
      if(_situation == undefined){
        navManager.goto("#copywriting")
      }

      this.currentSituations = situations[_situation];

      $(".content").html("");
      $("[name=emotions]").remove();

      var pill = "<span class='pill pill-situation'><span class='value'>"+_situation+"</span> &nbsp;&times;</span>";
      $(".pills").html("")
      $(".pills").append(pill);

      var emotionsSelect = "<select name='emotions'>";
          emotionsSelect += "<option>Select an emotion</option>";
      var emotionsHub = "<div class='row'>";

      _.each(this.currentSituations, $.proxy(function(_key){
        var disabled = "";
        if(this.data[_key]["Conseil 1"].length == 1){
          disabled = "disabled";
        }

        console.log(this.data[_key])

        emotionsSelect += "<option value='"+this.data[_key].EmotionLabel+"' " + disabled + ">"+this.data[_key].Emotion+"</option>";
        emotionsHub += "<div class='col-md-6 emotion' data-disabled='" + disabled + "' data-emotion='" + this.data[_key].EmotionLabel + "'><h2>" + this.data[_key].Emotion + "</h2></div>";
      }, this))

      emotionsSelect += "</select>";
      emotionsHub += "</div>";
      $(".selects").append(emotionsSelect);
      $(".content").html(emotionsHub);

      navManager.h.pushState({
          dest: "copywriting",
          situation: _situation
        },
        "CopyWriting",
        "#copywriting/" + _situation);
    },

    onSelectEmotion: function(_e) {
      if(_e == undefined){
        this.selectSituation($(".pill-situation .value"));
        return;
      }

      var pill = "<span class='pill pill-emotion' data-emotion='" + _e.target.value + "'><span class='value'>"+_e.target.value+"</span> &nbsp;&times;</span>";
      if($(".pill").length < 2) $(".pills").append(pill);

      _.each(this.currentSituations, $.proxy(function(_key){
        console.log()
        if(this.data[_key].EmotionLabel == _e.target.value){
          this.createContent(this.data[_key])
        }
      }, this))
      navManager.h.pushState({
          dest: "copywriting",
          situation: navManager.h.state.situation,
          emotion: _e.target.value
        },
        "CopyWriting",
        "#copywriting/" + navManager.h.state.situation + "/" + _e.target.value);
    },

    createContent: function(_data){
      var d = {
        advice1: _data["Conseil 1"],
        advice2: _data["Conseil 2"],
        advice3: _data["Conseil 3"],
        advice4: _data["Conseil 4"],
        advice5: _data["Conseil 5"],
        memberSituation: _data["MemberSituation"],
        memberExample: _data["MemberExample"],
        hostSituation: _data["HostSituation"],
        hostExample: _data["HostExample"],
        prodSituation: _data["ProdSituation"],
        prodExample: _data["ProdExample"]
      }

      $.get("templates/copy-example.html", $.proxy(function(_template){
        var compiled = _.template(_template);
        var t = compiled(d);
        $(".content").html(t);
      }, this));
    }
  }

  CopyWriting.init();
})
