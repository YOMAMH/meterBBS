//noinspection JSUnresolvedVariable
/**
 * Created by renminghe on 16/6/29.
 */
import {Session} from 'meteor/session';
Session.setDefault("info",{success:"",error:""});

Template.info.helpers({
    info(){
        return Session.get("info");
    }
});

Template.container.helpers({
    currentUrl(){
        return  Session.get("currentUrl");
    }
});

/*----------------------------------------------用backbone框架设置路由--------------------------------------------*/
var urlRouter = Backbone.Router.extend({
    routes:{
        "":"index",
        "login":"login",
        "reg":"reg",
        "logout":"logout"
    },
    index: function () {
        Session.set("currentUrl",{index:"active",login:"",reg:""});


    },
    login: function () {
        if(Meteor.userId()){
            this.navigate("/",true);
            Session.set("info",{success:"",error:"用户已在线"});
            return;
        }
        Session.set("currentUrl",{index:"",login:"active",reg:""});
    },
    reg: function () {
        if(Meteor.userId()){
            this.navigate("/",true);
            Session.set("info",{success:"",error:"用户已在线"});
            return;
        }
        Session.set("currentUrl",{index:"",login:"",reg:"active"});
    },
    logout: function () {
        if(Meteor.userId()){
            Meteor.logout();
            this.navigate('/',true);
            Session.set("info",{success:"登出成功",error:""});
            return;
        }else {
            this.navigate("/",true);
            Session.set("info",{success:"",error:"用户不在线"});
        }

    },
    redirect: function (url) {
        this.navigate(url,true);
    }
});
Router = new urlRouter;

//听过监听hashchange事件并分配路由
Meteor.startup(function () {
    Backbone.history.start({pushState:true});
});

Template.nav.helpers({
    active(){
        return Session.get("currentUrl");
    }
});


//注册事件处理程序
Template.reg.events({
    'click #submit': function (evt) {
        evt.preventDefault();
       var $username = $('#username').val();
       var $password = $('#password').val();
       var $password_repead = $('#password-repeat').val();
        if($password.length == 0 || $username.length == 0){
            Session.set("info",{success:"",error:"用户名或密码不能为空"});
            return;
        }
        if($password_repead!=$password){
            Session.set("info",{success:"",error:"两次输入的密码不一致"});
            return;
        }
        Accounts.createUser({username:$username,password:$password}, function (err) {
            if(err){
                Session.set("info",{success:"",error:err.reason});
            }else {
                Router.redirect('/'); //跳转到主页
                Session.set("info",{success:"注册成功",error:""});
            }
        });
    }
});


//登陆事件处理程序
Template.login.events({
    'click #submit': function (evt) {
        evt.preventDefault();
        var $username = $('#username').val();
        var $password = $('#password').val();
        if($password.length == 0 || $username.length == 0){
            Session.set("info",{success:"",error:"用户名或密码不能为空"});
            return;
        }
        Meteor.loginWithPassword($username,$password, function (err) {
            if(err){
                Session.set('info',{success:"",error:"用户名或密码错误"});
            }else {
                Router.redirect("/");
                Session.set("info",{success:"登陆成功",error:""});
            }
        });
    }
});

/*----------------------------------------------index模块--------------------------------------------*/
Posts = new Mongo.Collection("posts");  //新建posts集合
Images = new Mongo.Collection("images");  //新建images集合
Template.index.events({
    'click #submit': function (evt) {
        evt.preventDefault(); //阻住浏览器默认事件
        var $post = $("#post").val();
        if($post.length == 0){
            Session.set('info',{success:"",error:"发表能容不能为空"});
            return;
        }
        Posts.insert({user:Meteor.user(),post:$post,time:new Date()}, function (err) {
            if(err){
                Session.set("info",{success:"",error:err.reason});
            }else {
                Session.set("info",{success:"发表成功!",error:""});
                $("#post").val("");
            }
        });
    }
});

Template.index.helpers({
    posts(){
        return Posts.find({},{sort: {time:-1}});
    },
    images(){
        return Images.find({});
    }
});