import React from 'react';
import {View, Text, FlatList, TouchableNativeFeedback, StyleSheet} from 'react-native';
import HttpUtils from "../../http/HttpUtils";
import LoadingView from "../../widget/LoadingView";
import ErrorView from "../../widget/ErrorView";
import EmptyView from "../../widget/EmptyView";
import * as config from "../../config";

const colors = ['orange', 'red', 'green', 'black', 'fuchsia', 'chocolate', 'hotpink', 'tomato'];
let navigation;

export default class App extends React.Component {

    static navigationOptions = {
        title: "知识体系",
    };

    constructor(props) {
        super(props);
        navigation = this.props.navigation;
        this.state = {
            isLoading: true,
            isError: false,
            errorInfo: "",
            data: []
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        HttpUtils.get("tree/json", null)
            .then(result => {
                this.setState({
                    isLoading: false,
                    isError: false,
                    data: result,
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    isError: true,
                    errorInfo: error,
                })
            });
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingView/>;
        } else if (this.state.isError) {
            return <ErrorView error={this.state.errorInfo}/>;
        }
        return <FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            ListEmptyComponent={<EmptyView/>}
            keyExtractor={(item, index) => index + ""}
        />
    }

    renderItem({item}) {
        return <TouchableNativeFeedback onPress={() => {
            navigation.navigate('Knowledge', {
                title: item.name,
                data: item.children,
                navigation: navigation
            });
        }}>
            <View style={styles.itemContainer}>
                <Text style={styles.title}>
                    {item.name}
                </Text>
                <View style={styles.contentContainer}>
                    {item.children.map((value, index) => {
                        let color = colors[index % (colors.length)];
                        return <View style={[styles.textContainer, {backgroundColor: color}]}>
                            <Text style={styles.content}>
                                {value.name}
                            </Text>
                        </View>
                    })}
                </View>
            </View>
        </TouchableNativeFeedback>
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: '#B5E3FF',
        margin: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        color: config.textColorPrimary,
        marginLeft: 10
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10
    },
    textContainer: {
        borderRadius: 5,
        padding: 6,
        margin: 5
    },
    content: {
        fontSize: 14,
        color: 'white',
    },
});