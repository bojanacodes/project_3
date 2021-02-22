/*
redirect here after log in? or login takes you to the page you were on when you logged in?

display host properties with POST, PUT, GET and DEL options
- do a get request for every single property id in user.properties array?

pass userId as props after login?

do we want property info in the user schema attached to hosts? -> This would work with route /users/:userID

route is: /users/:userID
*/

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Paginate from './Paginate'

export default function HostProfileComponent(props) {


  console.log('Host props:', props.userId)

  const userId = props.userId

  const [allProperties, updateAllProperties] = useState([])
  const [userProperties, updateUserProperties] = useState([])

  const [propertiesLoading, updatePropertiesLoading] = useState(true)

  const resultsPerPage = 3
  const [pageNum, updatePageNum] = useState(1)

  useEffect(() => {


    try {

      axios.get('/api/properties')
        .then(({ data }) => {
          console.log('host all properties', data)
          updateAllProperties(data)

          const allPropertiesData = data

          const filteredProperties = allPropertiesData.filter(item => item.host._id === userId)

          console.log('host filtered properties:', filteredProperties)

          updateUserProperties(filteredProperties)

          updatePropertiesLoading(false)

        })



    } catch (err) {
      console.log('Error:', err)
    }
  }, [])

  if (propertiesLoading) {
    return <div className='loading'>
      <img src='https://i.ibb.co/xDS2vQc/loading.gif' />
    </div>
  }

  function handlePageChange(newValue) {
    updatePageNum(newValue)
  }

  console.log('updated user properties', userProperties)

  return <div className="section">
    <div>
      <h2 className='title is-4 mb-4'>Properties profile</h2>

      <Paginate
        onChange={handlePageChange}
        pageNum={pageNum}
        totalResults={userProperties.length}
        resultsPerPage={resultsPerPage}
      />
    </div>
  
    <div>

      {userProperties.map((item, index) => {
        console.log('host userProperties map:', userProperties)
        return <div className='box columns mb-4' key={index}>
          <div className="column">
            <h4 className='title is-4 mb-2'>{item.name}</h4>
            <button className="button is-primary is-light mb-2">Edit property</button>
            <button className="button is-danger is-light mb-2">Delete property</button>
          </div>
          <div className="column">
            <img width="200" src={item.images[0] ? item.images[0] : 'http://placehold.it/400x400?text=no%20image%20available'} />
          </div>

        </div>
      })}
    </div>

    <div>
      <button className='button is-primary mt-5'>Add a property</button>
    </div>
  </div>

}



 