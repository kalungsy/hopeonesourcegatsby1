import React from "react"
import { Link } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
// import 'antd/dist/antd.css';
import { Select, Checkbox } from 'antd';
// var ReactSafeHtml = require('react-safe-html');
const CheckboxGroup = Checkbox.Group;
const IndexPage = (props) => {
  const data = useStaticQuery(graphql`
  query articlesQuery {
    allNodeArticle {
      nodes {
        id
        body {
          summary
          value
        }
        title
        status
      }
    }
  }
`)

  const plainOptions = ['Apple', 'Pear', 'Orange'];

  return <Layout>
    {console.log(data)}
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    
    <CheckboxGroup
        options={plainOptions}
        onChange={(values)=>{console.log("current values", values)}}
    />

    <h1>Demo Drupal Content</h1>
    {
      data.allNodeArticle.nodes.map(item=>
        <div key={item.id}><h2>{item.title}</h2>
        {/* <ReactSafeHtml html={item.body.values} /> */}
        <p>{item.body.values}</p> 
        </div>
      )
    }
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
}

export default IndexPage
