import { useRouter } from 'next/router';

const DetailPage = () => {
    const router = useRouter();
    const { id, postId } = router.query;

    if (!id || !postId) {
        return <div>Loading...</div>;
    }

    // process data

    return (
        <div>

        </div>
    );
};

export default DetailPage;