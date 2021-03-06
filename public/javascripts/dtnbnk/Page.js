Page = ContentItem.extend({
	init: function(data, element) {
		this.__super__(data, element);
		this.data = $.extend({
			type: "page"
		}, data || {});
		this.link = $("<a><span></span></a>");
		
		this.buildex();
		if (getUser()) $(".edit",this.link).show(); else $(".edit",this.link).hide();
	},
	generateName: function(base, i, callback) {
	  i = i || 1;
	  var pagename = (i>1)?i.toString().ordinalize()+" "+base:base;
	  var father = this;
	  var cb = callback;
	  $.postJSON("testquery",{type: "page", name: pagename},function(data,el) {
      items = JSON.parse(data);
      if (items.length) father.generateName(base, i+1, cb); else father.setName(pagename, cb);
    });
	},
	setName: function(name, callback) {
	  this.data.name = name;
	  this.data.url = name.dasherize();
    if (this.link) {
      $("span",this.link).text(name);
      this.link.attr("href","#/"+this.data.url);
    } 
    if (callback) callback();
	},
	refreshsort: function(container) {
		this.data.sort = $("> li",container).index(this.link.parent());
		this.update();
	},
	update: function(callback) {
	  console.log("save page");
	  var father = this;
	  var cb = callback;
	  if (!this.data.name) this.generateName("Page", 1, function(){
	    father.update(cb);
	  }); else this.__super__(callback);
	},
	buildex: function() {
		this.element.addClass("page");
		this.container = $("<div/>").addClass("content").appendTo(this.element);

		if (this.link) {
      $("span",this.link).text(this.data.name);
      this.link.attr("href","#/"+this.data.url);
      var father = this;
      $("<img src='/images/picol_prerelease_16_090307/badge_eject_16.png' class='edit sort' />").appendTo($(this.link));
      $("<img src='/images/picol_prerelease_16_090307/badge_edit_16.png' class='edit rename' />").appendTo(this.link).click(function() {
        $("span", father.link).trigger("edit");
  			return false;
  		});
  		$("<img src='/images/picol_prerelease_16_090307/badge_cancel_16.png' class='edit delete' />").appendTo(this.link).bind("click",this, function(e) {
  		  console.log(e.data);
  		  return false;
  		});
  		
  		
      // click(function() {
      //         father.remove_allchildren();
      //         return false;
      // });
  		$("span", this.link).makeeditable(this,{event:"edit"}, function(value, settings) { 
        father.generateName(value, 1, function(){
         father.update();
        });
    		return(value);
    	});
    }
		var father = this;
		this.buttons = this.editElement;
		$("<div />").Button(function() {
			father.add(new Paragraph({name:"Paragraph"},$("<div/>")));
		},"New Paragraph").appendTo(this.buttons);
		$("<div />").Button(function() {
			father.add(new H1({name:"Heading"},$("<div/>")));
		},"New Heading").appendTo(this.buttons);
		$("<div />").Button(function() {
			father.add(new Image({},$("<div/>")));
		},"New Image").appendTo(this.buttons);
		if (this.data.include && this.data.include.forward_items) {
			var father = this;
			var sorted_items = this.data.include.forward_items.sort(function (a,b) {
				return (a.sort > b.sort)?0:-1;
			});
			$.each(sorted_items, function(i,ob) {
				var item = makenew(ob);

				father.add(item);
			});
			this.makesortable();			
		}
//		console.log(this.items);

	}
})