var connection = new require("./kafka/Connection");
//topics files
//var signin = require('./services/signin.js');
var mygroups = require("./services/mygroups.js");
var addbill = require("./services/addbill");
var addcomment = require("./services/addcomment");
var invitegroups = require("./services/invitegroups");
var getbillsofgroup = require("./services/getbillsofgroup");
var getmembersofgroup = require("./services/getmembersofgroup");
var getcommentsofbill = require("./services/getcomments");
var creategroup = require("./services/creategroup");

function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function (message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, function (err, res) {
      console.log("after handle" + res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, function (err, data) {
        console.log(data);
      });
      return;
    });
  });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("mygroups1", mygroups);
handleTopicRequest("addbill1", addbill);
handleTopicRequest("addcomment", addcomment);
handleTopicRequest("invitegroups", invitegroups);
handleTopicRequest("getbillsofgroup", getbillsofgroup);
handleTopicRequest("getmembersofgroup", getmembersofgroup);
handleTopicRequest("getcommentsofbill", getcommentsofbill);
handleTopicRequest("creategroup", creategroup);
