//Quick test script which can be used to verify functionality.

console.log('Beginning jQuery EzQ plugin test script.');

var i = 0;
var testq = $('body').ezq({
    q: {
        name: 'testq',
        autoDelay: false,
        autoDelayMs: 3000
    },
    init: function() {
        console.log('Initialized');
    },
    shouldContinue: function() {
        i++;
        console.log(i);
        if(i < 2)
            return false;
        return true;
    }
});

console.log(' ');
console.log(testq);
//A reference is stored in the DOM element's data object
console.log($('body').data('ezq-' + testq.q.name));

console.log(' ');
console.log('------------------------');
console.log(' ');

console.log('is processing? (raw)' + testq.q.processing);

testq.qAction(function(next) {
    i = 0;
    console.log('first action');
    next();
}).qAction(function(next) {
    i = 0;
    console.log('second action');
    next();
}).qAction(function(next) {
    i = 0;
    console.log('third action');
    next();
});

console.log(' ');
testq.processQ();
console.log('is processing? (raw)' + testq.q.processing);
console.log(' ');
console.log('------------------------');
console.log(' ');
//Now delay 3 seconds before checking if shouldContinue(), which will run twice before returning true
//Also, remember to change this value BEFORE queuing more actions. The autoDelay function is not queued if this is FALSE at the time qAction() is executed.
testq.q.autoDelay = true;

testq.qAction(function(next) {
    i = 0;
    console.log('first action');
    next();
}).qAction(function(next) {
    i = 0;
    console.log('second action');
    next();
}).qAction(function(next) {
    i = 0;
    console.log('third action');
    next();
});

testq.processQ();
console.log('is processing? (raw)' + testq.q.processing);

testq.qAction(function(next) {
    console.log(' ');
    console.log('------------------------');
    console.log(' ');
	console.log('jQuery EzQ plugin test script has completed successfully!');
	next();
});