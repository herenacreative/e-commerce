import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, Card, Topbar } from '../../Components';
import style from './style';
import { color } from '../../Assets/Styles';

import { updateUser } from '../../Utils/Api';
import { setUpdateUser } from '../../Redux/Actions/users/users';
import { splitString } from '../../Utils/helper';

const shipingAddress = props => {
    const navigation = useNavigation();
    const user = props.user;
    const [activeCard, setActiveCard] = useState(user.address_active);
    const [address, setAddress] = useState();

    useEffect(() => {
        if (user.address) {
            const userAddress = splitString(user.address);
            setAddress(userAddress);
        }
        setActiveCard(user.address_active)
    }, [user])

    useEffect(() => {
        if (!address && user.address) {
            const userAddress = splitString(user.address);
            setAddress(userAddress);
        }
    }, [props.user])

    const handleActivate = (key) => {
        const data = { address_active: key };
        updateUser(data, user.id, user.tokenLogin).then(res => {
            if (res) {
                props.setUpdateUser(data);
                setActiveCard(key);
            }
        })
    }

    return (
        <View style={{flex: 1, position: 'relative'}}>
            <Topbar backNav={true} title='Shiping Address' />
            <ScrollView style={{ ...style.fullContainer, flex: 1 }} contentContainerStyle={{paddingBottom: 90}}>
                {/* <View style={style.searchBar}>
                    <Ionicons name='search' size={16} color={color.fade} />
                    <TextInput
                        style={style.searchInput}
                        placeholder='Search'
                        placeholderTextColor={color.fade}
                        onChangeText={text => setSearch(text)}
                        onSubmitEditing={({ nativeEvent }) => handleSubmitSearch(nativeEvent.text)}
                    />
                </View> */}

                <Text style={style.subTitleText}>Shipping Address</Text>
                <View>
                    {address
                        ? address.length > 1 
                            ? address.map((address, key) => {
                                return (
                                    <Card
                                        key={key}
                                        dataAddress={address}
                                        indexCard={key}
                                        isActive={key === activeCard ? true : false}
                                        onPress={() => handleActivate(key)}
                                    />
                                )
                            })
                            : address.map((address, key) => {
                                return (
                                    <>
                                        <View onLayout={() => handleActivate(key)}></View>
                                        <Card
                                            key={key}
                                            dataAddress={address}
                                            indexCard={key}
                                            isActive={key === activeCard ? true : false}
                                            onPress={() => handleActivate(key)}
                                        />
                                    </>
                                )
                            })
                        :
                        <Text style={[style.exceptionText, style.standaloneCenter]}>No address yet.</Text>}
                </View>
            </ScrollView>
            <View style={style.buttonBackground}>
                <Button title='Add new address' type='fullwidth' style={color.light} onPress={() => navigation.navigate('Address')} />
            </View>
            {/* <View style={{ height: 30 }}></View> */}
        </View>
    )
}

const mapStateToProps = state => ({
    payment: state.transaction.payment,
    user: state.auth.auth
});

const mapDispathToProps = { setUpdateUser };

export default connect(mapStateToProps, mapDispathToProps)(shipingAddress);