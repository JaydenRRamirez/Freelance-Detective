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
      this.key = key;
        //let locationData = undefined; // TODO: use `key` to get the data object for the current story location
        let locationData = this.engine.storyData.Locations[key];
        console.log("Creating location for key:", key);
        //this.engine.show("Body text goes here"); // TODO: replace this text by the Body of the location data
        //this.engine.show(locationData.Body);
        //if(true) { // TODO: check if the location has any Choices
            //for(let choice of ["example data"]) { // TODO: loop over the location's Choices
                //this.engine.addChoice("action text"); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
          //  }
        //} else {
          //  this.engine.addChoice("The end.")
        //}
        if (locationData.Scene) {
          this.engine.gotoScene(locationData.Scene, key);
          return;
        }
        this.engine.setTitle(key);
        this.engine.show(locationData.Body);

        for (let [itemName, itemData] of Object.entries(this.engine.storyData.Items || {})) {
          if (itemData.Location === key && !this.engine.inventory.includes(itemName)) {
            this.engine.show(`You found a <b>${itemName}</b>.`);
            this.engine.addChoice(`Pick up ${itemName}`, {pickUp: itemName});
          }
        }
        if(locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                //this.engine.addChoice(choice.Text, choice);
                if (!choice.Requires || this.engine.inventory.includes(choice.Requires)) {
                  this.engine.addChoice(choice.Text, choice);
                } else {
                  this.engine.show(`(${choice.Text} - locked)`);
                }
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }
    handleChoice(choice) {
      //this.key = this.key;
      //const locationData = this.engine.storyData.Locations[key];
      if (choice.pickUp) {
        this.engine.show(`You picked up: <b>${choice.pickUp}</b>,`);
        this.engine.inventory.push(choice.pickUp);
        this.engine.gotoScene(Location, this.key);
      } else if (choice) {
        this.engine.show("&gt; " + choice.Text);
        this.engine.gotoScene(Location, choice.Target);
      } else {
        this.engine.gotoScene(End);
      }
    }
  }
  class DeleteNewsScene extends Scene {
    create(key) {
      this.engine.setTitle("File Cabinet");
      this.engine.show("It's a good thing that this convenient cabinet labeled Mob Bribes contains the very file you were told to make disappear, but this doesn't seem very lawful to you, should we rid the document?");
      this.engine.addChoice("Erase the incriminating evidence?", {delete: true});
      this.engine.addChoice("Don't be peer pressured.", {Target: "File Cabinet"});
    }
    handleChoice(choice) {
      if (choice.delete) {
        this.engine.show("You burn the file, then throw the lighter and burn the rest of the files, hoping that now every mob owes you one.");
        this.engine.inventory.push("DeletedNewsData");
        this.engine.gotoScene(Location, "Local Mob Hideout");
      } else if (choice.Target) {
        this.engine.gotoScene(Location,choice.Target);
      }
    }
  }
  class End extends Scene {
    create() {
      this.engine.show("<hr>");
      this.engine.show(this.engine.storyData.Credits);
    }
  }
  class InsideMobHideoutScene extends Scene {
    create() {
      this.engine.setTitle("Welp, looks like we cracked the case!");
      this.engine.show("Pick the OBVIOUS suspect.");
      
      if (this.engine.inventory.includes("MissingKnife")) {
        this.engine.addChoice("Accuse Sam Max", {Target: "Case Closed!"});
      }
      
      if (this.engine.inventory.includes("DeletedNewsData")) {
        this.engine.addChoice("Accuse Faline Offdeedge", {Target: "Case Closed?"});
      }
    }
    
    handleChoice(choice) {
      if (choice && choice.Target) {
        this.engine.gotoScene(Location, choice.Target);
      }
    }
  }
Engine.load(Start, 'myStory.json');