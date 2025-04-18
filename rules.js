class Start extends Scene {
    create() {

        //let person = {
          //  name: "bob",
            //age: 12,
            //pets: [
              //  "dog",
                //"snake",
                //"fish"
            //]
        //}

        //let person = {
          //  name: "bob",
            //age: 12,
            //pets: [
              //  {
                //    name: "dan",
                  //  type: "dog"
                //},
                //{
                  //  name: "donny",
                    //type: "fish"
                //},
                //{
                  //  name: "dilbert",
                    //type: "dog"
                //},
            //]
        //}

        //let query = "age";
        //let person = {
          //  name: "bob",
            //age: 12,
        //}
        //console.log([query])
        //console.log(person.name)
        //console.log(person.pets[0])
        console.log(this.engine.storyData);
        console.log(this.engine.storyData.Locations);
        // this.engine.setTitle("Title goes here"); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.setTitle(this.engine.storyData.Title)
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        // this.engine.gotoScene(Location, "Home"); // TODO: replace this text by the initial location of the story
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        //let locationData = undefined; // TODO: use `key` to get the data object for the current story location
        let locationData = this.engine.storyData.Locations[key];
        //this.engine.show("Body text goes here"); // TODO: replace this text by the Body of the location data
        this.engine.show(locationData.Body);
        //if(true) { // TODO: check if the location has any Choices
            //for(let choice of ["example data"]) { // TODO: loop over the location's Choices
                //this.engine.addChoice("action text"); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
          //  }
        //} else {
          //  this.engine.addChoice("The end.")
        //}
        if(locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');