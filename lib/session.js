export async function getServerSideProps(context) {
    const session = await getSession(context);
  
    if (!session) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }
  
    return {
      props: {}, // Passer les données nécessaires à la page
    };
  }
  