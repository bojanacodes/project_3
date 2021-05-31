# ![General Assembly logo](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) Project #3: A MERN Stack App


## Technical Requirements

* Work in a team, using **git to code collaboratively**.
* **Build a full-stack application** by making your own backend and your own front-end
* **Use an Express API** to serve your data from a Mongo database
* **Consume your API with a separate front-end** built with React
* **Be a complete product** which most likely means multiple relationships and CRUD functionality for at least a couple of models
* **Implement thoughtful user stories/wireframes** that are significant enough to help you know which features are core MVP and which you can cut
* **Have a visually impressive design** 
* **Be deployed online** 
* **Have automated tests** for _at least_ one RESTful resource on the back-end. 

## Overview and Concept

This was a group project - four of us had a week to build a MERN stack app. We decided to build a holiday rentals website, which got my vote not least so that I could legitimately have an excuse to browse images of holiday destinations after months of not going further than my local parks.

Users can search by entering location names, by checking some or all of the amenities listed and by selecting dates, to exclude properties which have already been booked for a particular date. Search results can also be changed and updated.

Users can click on a property to view more details about it, and about the property's host. 

Users can book a property. Hosts of a property and users who have made a booking for that property can also comment on that property. While the comments can be read by everyone, only the users who wrote a comment can amend or delete it. 

On a user's profile, their details can be updated and bookings can be viewed. Hosts can also see their properties and can click to edit or delete their properties.

The website is available here: https://project-3-arrivr.herokuapp.com/

## Technologies Used

* HTML
* CSS
* JavaScript
* React
* Date-io Moment
* Axios
* Express
* Jsonwebtoken
* Mongoose
* Node.js
* Chai
* Mocha
* Supertest
* Bulma


## Tools used

* VS Code
* Insomnia
* Git 
* GitHub
* Npm 
* Google Chrome Developer tools
* Unsplash

## Approach Taken

We decided to work together to get the back-end configuration set up as much as possible. We used LiveShare on VS Code to do this. Once this was done, it was easier to work independently on different components. I also added some data on properties to work with while building and testing.

The first code I wrote independently was some tests for getting the property data, for example:

```
it('array[0] should contain a Boolean property isRoomOnly', done => {
    api.get('/api/properties')
      .end((err, res) => {
        expect(res.body[0].isRoomOnly).to.be.a('boolean')
        done()
      })
  })
```

The tests were written using the Chai assertion library, using the Mocha test framework.

We then moved on to the front-end. I was responsible for the user profile components. 

![User profile page](https://i.imgur.com/CElLcpw.png)




The first component to be written was the basic page, to display the user's details, which would appear on all users, whether they were guest users only or if they were also hosts.

I used Axios and the Effect Hook to get the user's logged-in data. To ensure the only data a user can see is that which belongs to their own account, the route is secure by using Jsonwebtoken.

A loader-spinner appears until all the data is ready to be displayed. The spinner is controlled by updating a state variable: userDataLoading, which defaults to 'true' when the page first loads and displays the spinner, until the data has been obtained and saved in a state variable, userData.

```
 function getUser() {
  
    axios.get(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(({ data }) => {

        updateUserData(data)
        updateUserDataLoading(false)

      })
  }

  useEffect(() => {
    getUser()
  }, [])
```

The React form contains fields which are pre-populated with the user's data, apart from the password, so that the user can check and update their details if necessary. A password confirmation is required. 

A handleChange function updates the userData state variable if any changes are made, and a handleSubmit function uses an Axios put request to submit the changes. A handleDelete function sends a delete request via Axios.

```
  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const { data } = await axios.put(`/api/users/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      getUser()
      updateErrorState(false)
      updateFormSuccess(true)
    } catch (err) {
      updateErrorState(true)
      updateError(err.response.data.message)
      updateFormSuccess(false)
    }
  }
```

For users who are hosts, an additional field is displayed here: their bio, which is publicly displayed when users click to find out more about a property's host from a property's page.

```
    {userData.isHost && 
              <div className="field">
                <label className="label mt-3">Bio</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={userData.bio}
                    onChange={handleChange}
                    name={'bio'}
                  />
                </div>
              </div>
            }
```

I added notifications which appear at the top of the page to either flag an error submitting changes or confirm they were successful. State variables are updated to control whether these notifications appear or disappear.

```
 {errorState ? <div className="notification is-danger">{error}</div> : <div className="notification is-hidden"></div>}

  {formSuccess ? <div className="notification is-success is-light">Your changes have been saved.</div> : <div className="notification is-hidden"></div>}
```


The next component which appears on this page in the middle column is for users who are hosts: they are able to view their listed properties on this page as a paginated list. They can click to go to a new page where they can view and edit or delete a property. 

This is done with useEffect to get all the properties which are listed on the site, and then this is filtered by the logged in user's id and saved in a state variable. 

```
  useEffect(() => {

    try {

      axios.get('/api/properties')
        .then(({ data }) => {
          const allPropertiesData = data
          const filteredProperties = allPropertiesData.filter(item => {
            if (item.host && item.host._id === userId) {
              return item
            }
          })
          updateUserProperties(filteredProperties)
          updatePropertiesLoading(false)

        })

    } catch (err) {
      console.log('Error:', err)
    }
  }, [])
```



I also wrote the code for the host profile component, which is the publicly accessible page about a property's host, so that any user who is interested in booking a property can find out more about the host, and view their other properties.

![Host profile public page view](https://i.imgur.com/xxpukYA.png)



An Axios get request obtains all the properties data and filters it by the host id, similar to above with a state variable being updated and a loading variable updated to false to remove the loader spinner, or display an error if there is one with the get request.

The host data is retrieved from the host endpoint, which only gets the host first name and bio at the back end, to minimise personal data security risks.

```
useEffect(() => {

    try {

      axios.get(`/api/host/${hostId}`)
        .then(({ data }) => {

          updateHostName(data[0])
          updateHostBio(data[1])
          updateNameLoading(false)

        })

    } catch (err) {
      console.log('Error:', err)
    }
  }, [])
```

The page then displays this information plus a paginated list of properties for the user to browse and click through to view the property page if interested.

## Bugs and Wins

Bugs: 
* There is a bug when a user successfully changes their password, but is then automatically logged out after the change
* The nav bar needs to be updated to the default logged out state when a user deletes their account
* When a booking is deleted from the bookings list, it needs to automatically reload to show the booking has been removed


Wins
* We were thorough in planning our models and that paid off
* We divided the work up well and were able to complete all our MVP features and add some extra features 


## Future Features

* An admin user with rights to edit and delete comments and properties
* Add a 5 star review option for users who have booked a stay on a property
* Direct messaging
* Adding a 'favourite' option for users to bookmark properties they are interested in and display them in their profile page

## Challenges

This project helped me understand the back-end of the MERN stack more confidently, particularly after going through the process of deciding the endpoints and how to structure our schemas.

While working on the front-end, I initially found passing props and state challenging and spent some time flipping between VS Code and the React docs to get this right.


## Key learnings

This was my first group project and I found working in a group really enjoyable and useful - we worked well together and came up with a detailed plan we all agreed on pretty seamlessly. Dividing tasks worked efficiently and it was great being able to discuss bugs or get other advice from the team, it's always interesting to view the same issue from somebody else's perspective. Emily and I also pair-programmed our way through some of our bugs which was both effective, and a good way to take a break from staring at code all day long by myself.

It was also good practice for choosing names for components and variables carefully as I had some regrets about names, so this was definitely a good lesson to learn for the future.



