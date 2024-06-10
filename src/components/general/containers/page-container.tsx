import { View } from 'react-native';
import { globalStyles } from '../../../assets/styles/global';
import React, { ReactNode } from 'react';

const AppPageContainer = ({ children }: { children: ReactNode }) => (
    <View style={globalStyles.pageContainer}>{children}</View>
);

export default AppPageContainer;
