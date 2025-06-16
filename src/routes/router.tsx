import { LoaderFunctionArgs, createBrowserRouter } from 'react-router-dom';
import Root from './root';
import ErrorPage from '../pages/ErrorPage';
import DashboardPage from '../pages/DashboardPage';
import UnauthenticatedRoute from './UnauthenticatedRoute';
import AuthenticatedRoute from './AuthenticatedRoute';
import WelcomePage from '../pages/WelcomePage';
import MatchDetailPage from '../pages/MatchDetailPage';
import ProfilePage from '../pages/ProfilePage'; // ✅ 引入

// ⬇️ 比賽詳情頁面的 loader（帶 matchId）
export async function loaderMatchId({ params }: LoaderFunctionArgs) {
  const matchId = params.matchId;
  return { matchId };
}

// ⬇️ 主路由設定
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <UnauthenticatedRoute>
        <WelcomePage />
      </UnauthenticatedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/root',
    element: (
      <AuthenticatedRoute>
        <Root />
      </AuthenticatedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'profile', // ✅ 個人資料頁面
        element: <ProfilePage />,
      },
      {
        path: 'match/:matchId',
        element: <MatchDetailPage />,
        loader: loaderMatchId,
      },
    ],
  },
]);
