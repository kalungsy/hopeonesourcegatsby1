import React from "react"
import { Link } from "gatsby"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = (props) => {
//   const data = useStaticQuery(graphql`
//   query articlesQuery {
//     allNodeArticle {
//       nodes {
//         id
//         body {
//           summary
//           value
//         }
//         title
//         status
//       }
//     }
//   }
// `)

  return <Layout>
    <SEO title="Home" />
      <h1>Hi people</h1>
      <p>Welcome to HopeOneSource's first Gatsby Site</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>

      <ul>
        <li>
          <Link to="/page-2/">Go to page 2</Link>
        </li>
        <li>
          <Link to="/create-post">Create a post</Link>
        </li>
      </ul>

  </Layout>
}

export default IndexPage
