import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { ConfigProvider, message, Result, theme, App as AntApp } from 'antd';
import './App.css';
import { MainLayout } from '../routers/layout';
import { useRouterMenus } from '../routers/config/hooks';
import { AppContext, AppContextProvider } from './app-context';
import { AppHeader } from './app-header';
import React from 'react';


export default function App() {
    const routers = useRouterMenus();
    return (
        <ConfigProvider
            theme={{
                algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
            }}
        >
            <AntApp>
                <AppHeader/>
                <Router>
                    <Routes>
                        <Route path="/" element={<MainLayout/>}>
                            {routers.map((item) => {
                                return <Route key={item.key} index={item.defaultRouter} path={item.path}
                                              element={item.routerElement}/>;
                            })}
                            <Route path="*" element={
                                <Result
                                    status="404"
                                    title="页面未找到"
                                />
                            }/>
                        </Route>
                    </Routes>
                </Router>
            </AntApp>
        </ConfigProvider>
    );
}
