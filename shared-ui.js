'use strict';

function SharedUI (change_callback, default_project) {

  /* Set the cache object here. Either localStorage or a "fake"
   * cache for compatibility
   */
  if (Modernizr.localstorage) {
    this.cache = localStorage;
  } else {
    this.cache = {};
  }

  this.cache_key = 'rmviz';
  this.project =
    this.cache[this.cache_key + '.project'] ||
    default_project ||
    REDMINE_PROJECT;
  this.change_callback = change_callback;

  console.log("Startup Redmine project is " + this.project);

  this.show_projects();
}

SharedUI.prototype = {
  show_projects: function () {
    var self = this;
    var list = d3.select('#projects-list');
    this._change_project(this.project);
    this.redmine.load_projects(function(projects) {
      var li = list.selectAll('li').data(projects);
      li.exit().remove();
      li.enter().append("li");
      li.html(function(d) { return '<a href="#" title="' + d.description + '" data-project-ident="' + d.identifier + '">' + d.name + '</a>'; });
      li.selectAll('a').on(
        'click',
        function () { self._change_project(d3.select(this).attr('data-project-ident')) }
      )
    });
  },
  _change_project: function (project) {
    this.cache[this.cache_key + '.project'] = project;
    this.redmine = new Redmine(this.project);
    d3.select('#projects-current').text(project);
    this.change_callback(this.redmine);
  }
}