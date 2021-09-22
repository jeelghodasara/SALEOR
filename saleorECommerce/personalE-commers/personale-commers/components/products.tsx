// import React from "react";
import React from "react";
// import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { useLatestProductsQuery } from "../src/generated/graphql";
import { ConnectResult, SaleorManager } from "@saleor/sdk";


import gql from "graphql-tag";
import { type } from "os";

export const homePageProductsQuery = gql`
  query HomePageProducts {
    shop {
      description
      name
    }
    categories(level: 0, first: 4) {
      edges {
        node {
          id
          name
          slug
          backgroundImage {
            url
          }
        }
      }
    }
  }
`;



const LatestProduct = /* GraphQL */ `
  query LatestProducts {
    products(first:10 , channel:"default-channel") {
     edges {
        node {
          id
          name
          description
          thumbnail{
            url
          }
        }
      }
    }
}
`;




// /* tslint:disable */
// /* eslint-disable */
// // @generated
// // This file was automatically generated and should not be edited.

// // ====================================================
// // GraphQL query operation: HomePageProducts
// // ====================================================

// export interface HomePageProducts_shop {
//   __typename: "Shop";
//   /**
//    * Shop's description.
//    */
//   description: string | null;
//   /**
//    * Shop's name.
//    */
//   name: string;
// }

// export interface HomePageProducts_categories_edges_node_backgroundImage {
//   __typename: "Image";
//   /**
//    * The URL of the image.
//    */
//   url: string;
// }

// export interface HomePageProducts_categories_edges_node {
//   __typename: "Category";
//   /**
//    * The ID of the object.
//    */
//   id: string;
//   name: string;
//   slug: string;
//   backgroundImage: HomePageProducts_categories_edges_node_backgroundImage | null;
// }

// export interface HomePageProducts_categories_edges {
//   __typename: "CategoryCountableEdge";
//   /**
//    * The item at the end of the edge.
//    */
//   node: HomePageProducts_categories_edges_node;
// }

// export interface HomePageProducts_categories {
//   __typename: "CategoryCountableConnection";
//   edges: HomePageProducts_categories_edges[];
// }

// export interface HomePageProducts {
//   /**
//    * Return information about the shop.
//    */
//   shop: HomePageProducts_shop;
//   /**
//    * List of the shop's categories.
//    */
//   categories: HomePageProducts_categories | null;
// }



// let CONNECTION: ConnectResult | null = null;

// const queFun=async ()=>{

//   const { apolloClient } = await getSaleorApi()
//   const [dataa, featuredProducts] = await Promise.all([
//     apolloClient.query({
//         query: homePageProductsQuery,
//         variables: { channel: "default-channel" },
//       })
//       .then(({ data }) => data),
//     // getFeaturedProducts(),
//   ]);




//   let lik="http://localhost:8000/graphql/"
//   let chn="default-channel"

//   const getSaleorApi = async () => {
//     if (!CONNECTION) {
//       const manager = new SaleorManager(
//         { lik , chn },
//         { options: { ssrMode: true } }
//       );
//       CONNECTION = await manager.connect();
//     }
  
//     return CONNECTION;
//   };

// }



export const Products : React.FC = (GetStaticProps) => {

  const { data, loading, error } = useLatestProductsQuery();

  // queFun()


  type abcd={
    name:String
    fName:String
  }

  interface xyz{
    name:String;
    fName:String;
  }


  function greet(Person:abcd){
    console.log("XYZ",Person.fName,Person.name)
  }
  greet({fName:"hello 123",name:"Jeel"});




  if (loading) return <div>Loading...</div>;
  if (error) return <div>Errror! {(error.message)}</div>;
  if (data) {
    console.log("data::", data);

    const LatestProducts=data?.products?.edges||[]
    
    
    return (
      <div className="main-div">
    <ul>
      {LatestProducts.map(({node:{name , thumbnail, description}})=>
        <div key={name}>
          <li>
            <img src={thumbnail.url}/>
            {name}
            {description}
          </li>
        </div>
      )}
    </ul>
    </div>
    ) 
  

}
  // return <div>products</div>;
};
