
// unbind view objects when closing them
Backbone.View.prototype.close = function () {
    console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};



$(document).ready(function() {
	// user menu dropdown
	$('.dropdown-toggle').dropdown();

	$(function() {
		
     });

    
});
