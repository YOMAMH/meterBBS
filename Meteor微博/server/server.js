/**
 * Created by renminghe on 16/7/1.
 */
Posts = new Mongo.Collection("posts");
Images = new Mongo.Collection("images");

//在服务端只允许当前用户且该文档属于该用户时才会被插入到集合中
Posts.allow({
    insert: function (userId,doc) {
        return userId && (doc.user._id === userId);
    },
    remove: function (userId) {
        return userId == "3qxAMYjkmCcqfkNqk";
    }
});
Images.allow({
    insert: function (userId) {
        return userId == "3qxAMYjkmCcqfkNqk";
    }
});