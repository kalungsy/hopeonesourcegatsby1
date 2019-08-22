import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';
import { useStaticQuery, graphql } from 'gatsby';
import Image from '../components/image';
import SEO from '../components/seo';
import {
	Form,
	Select,
	Checkbox,
	DatePicker,
	TimePicker,
	Input,
	Radio,
	Upload,
	Button,
	Card,
	Row,
	Col,
	Icon,
	notification,
	message
} from 'antd';
import DateRange from '../components/form-components/date-picker';
import Map from '../components/form-components/map';
import { getWebLocation, getGeoFeature, getGeoIpInfo } from '../components/utils';
import moment from 'moment';

const settings = {
	messageLimit: 150
};
const CheckboxGroup = Checkbox.Group;
const TextArea = Input.TextArea;
const { Option } = Select;

const CreatePostForm = (props) => {
	let [ loading, setLoading ] = useState('initial');
	let [ imageUrl, setImageUrl ] = useState('');
	let [ excIncDates, setExcIncDates ] = useState([ { exclude: true, date: null } ]);
	let [ messageCharCount, setMessageCharCount ] = useState(0);
	let [ serviceRecurringEvery, setServiceRecurringEvery ] = useState('every week');
	let [ messageSendTime, setMessageSendTime ] = useState(1);
	let [ myCoordinates, setMyCoordinates ] = useState({ lat: 37.7577, long: -122.4376 });
	let [ usingMyLocation, setUsingMyLocation ] = useState(false);
	let [ geoFeatureData, setGeoFeatureData ] = useState(null);
	let [ address, setAddress ] = useState('');

	console.log("rendered state", excIncDates);

	const dateFormat = 'MM/DD/YYYY';
	const categoriesOptions = [
		'Child Care',
		'Clothing / Haircuts',
		'Education / Training',
		'Emergency / Safety',
		'Food / Meals',
		'Financial / Credit Counseling',
		'Homeless Prevention',
		'Housing Assistance',
		'Job Placement',
		'Legal Assistance',
		'Medical Assistance',
		'Mental Health / Crisis Support',
		'Peer Support',
		'Restrooms / Showers',
		'Shelter',
		'Transportation'
	];
	const demographicOptions = [
		'Disconnected / Unaccompanied Youth',
		'Ex-Offenders / Re-integration',
		'Families',
		'LGBTQ',
		'Non-Citizens / Undocumented Migrants',
		'Recovering Substance Users',
		'Senior / Elderly',
		'Single Adult Females',
		'Single Adult Males',
		'Veterans',
		'Victims of Crime / Demoestic Violence'
	];
	const repeatsDaysOptions = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
	const repeatsDaysOptionsShort = [ 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun' ];
	const housingStatusOptions = [ 'At-risk', 'Currently Homeless', 'Stable Housing' ];

	const handleSubmit = (e) => {
		console.log('submit', e);
		e.preventDefault();
		props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
	};

	const { getFieldDecorator, setFieldsValue, getFieldsValue, getFieldValue } = props.form;

	useEffect(() => {
		
		if(loading === 'initial'){
			const geoIpResult = getGeoIpInfo();
			console.log('geoIpResult', geoIpResult)
			if(geoIpResult.latitude && geoIpResult.longtitue){
				setMyCoordinates({lat: geoIpResult.latitude, long: geoIpResult.longtitue})
			}
		}

	})

	return (
		<Layout>
			<SEO title="Create Post" />
			<Row>
				<Card>
					<h2>Create a new service</h2>
					<p>
						Your post will be sent as a text message to individuals registered with HopeOneSource and will
						be saved in our Service Catalog.
					</p>
				</Card>
			</Row>
			<Form onSubmit={handleSubmit}>
				<Row>
					<Card>
						<h3 className="__card-title">
							<Icon type="user" /> Your Service
						</h3>
						<p>
							When is your service available? Select the dates clients can access your service within a 3
							month period.
						</p>
						<Row>
							<h4>What is your service?</h4>
							<p>Enter a short sentence about what you are providing for this service.</p>
							<Form.Item>
								{getFieldDecorator('service_title', {
									rules: [
										{
											required: true,
											message: 'This is required.'
										}
									]
								})(<Input size="large" placeholder="Example: Free lunch served" />)}
							</Form.Item>
						</Row>
						<Row>
							<h4>Select your service type</h4>
							<Form.Item>
								{getFieldDecorator('service_type', {
									rules: [
										{
											required: true,
											message: 'This is required.'
										}
									],
									initialValue: 'one_time'
								})(
									<Radio.Group
										className="__flex"
										onChange={(e) => {
											setFieldsValue({ service_type: e.target.value });
										}}
									>
										<Radio value={'one_time'}>One Time</Radio>
										<Radio value={'recurring'}>Recurring</Radio>
									</Radio.Group>
								)}
							</Form.Item>
						</Row>
						<Row>
							<Col xs={24} md={8}>
								{getFieldValue('service_type') === 'one_time' && <h4>Service date</h4>}
								{getFieldValue('service_type') === 'recurring' && <h4>Service starts on</h4>}
								<DatePicker
									readonly="true"
									format={dateFormat}
									showToday={false}
									defaultValue={moment()}
									onChange={(date, dateString) => {
										console.log('service date', date, dateString);
									}}
								/>
							</Col>
							<Col xs={24} md={8}>
								<h4>Start time</h4>
								<TimePicker
									readonly="true"
									use12Hours
									format="h:mm a"
									defaultValue={moment('06:00', 'HH:mm')}
									onChange={(time, timeString) => {
										console.log('time changed', time);
									}}
									placeholder="Select start time"
								/>
							</Col>
							<Col xs={24} md={8}>
								<h4>End time</h4>
								<TimePicker
									readonly="true"
									use12Hours
									format="h:mm a"
									defaultValue={moment('17:00', 'HH:mm')}
									onChange={(time, timeString) => {
										console.log('time changed', time);
									}}
									placeholder="Select end time"
								/>
							</Col>
						</Row>
						{getFieldValue('service_type') === 'recurring' && (
							<Row>
								<Col xs={24}>
									<h4 style={{ marginBottom: '15px' }}>
										Service repeats{' '}
										<Select
											size="large"
											value={serviceRecurringEvery}
											style={{ width: '220px', marginLeft: '8px', marginRight: '8px' }}
											onChange={(value) => {
												setServiceRecurringEvery(value);
											}}
										>
											<Option value="every week">Every</Option>
											<Option value="every other">Every other</Option>
											<Option value="every month">Every month's</Option>
											<Option value="every year">Every year's</Option>
										</Select>
										{serviceRecurringEvery == 'every year' && (
											<Select
												mode="multiple"
												size="large"
												defaultValue={[ 1 ]}
												style={{ minWidth: '150px', width: 'auto', marginRight: '8px' }}
											>
												<Option value={1}>January</Option>
												<Option value={2}>Febuary</Option>
												<Option value={3}>March</Option>
												<Option value={4}>April</Option>
												<Option value={5}>May</Option>
												<Option value={6}>June</Option>
												<Option value={7}>July</Option>
												<Option value={8}>August</Option>
												<Option value={9}>September</Option>
												<Option value={10}>October</Option>
												<Option value={11}>November</Option>
												<Option value={12}>December</Option>
											</Select>
										)}
										{(serviceRecurringEvery == 'every month' ||
											serviceRecurringEvery == 'every year') && (
											<Select
												mode="multiple"
												size="large"
												defaultValue={[ 1 ]}
												style={{ minWidth: '150px', width: 'auto', marginRight: '8px' }}
											>
												<Option value={1}>1st</Option>
												<Option value={2}>2nd</Option>
												<Option value={3}>3rd</Option>
												<Option value={4}>4th</Option>
												<Option value={5}>Last</Option>
											</Select>
										)}
										week on ...
									</h4>
									<CheckboxGroup
										className={`__flex __col-4 __col-7`}
										options={repeatsDaysOptionsShort}
										onChange={(values) => {
											console.log('current values', values);
										}}
									/>
								</Col>
							</Row>
						)}
						{getFieldValue('service_type') === 'recurring' && (
							<Row>
								<Col xs={24} md={8}>
									<h4>Service's last day is on</h4>
									<DatePicker
										format={dateFormat}
										onChange={(date, dateString) => {
											console.log('service date', date, dateString);
										}}
									/>
								</Col>
							</Row>
						)}
						<Row>
							<h4>Describe your service</h4>
							<p>This description will be posted on the our service listing page.</p>
							<TextArea
								autosize={{ minRows: 6, maxRows: 8 }}
								onChange={(e) => {
									console.log(e.target.value);
									setMessageCharCount(e.target.value.length);
								}}
							/>
						</Row>

						<Row>
							<h4>Upload Flyer Image (Optional)</h4>
							<p>
								This image will be displayed on your service post. You can upload an image such as flyer
								about your service / event.
							</p>
							<Upload
								name="flyer_upload"
								listType="picture-card"
								className="avatar-uploader"
								showUploadList={false}
								action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
								beforeUpload={beforeUpload}
								onChange={(info) => {
									if (info.file.status === 'uploading') {
										setLoading('flyer_upload');
										return;
									}
									if (info.file.status === 'done') {
										// Get this url from response in real world.
										getBase64(info.file.originFileObj, (imageUrl) => {
											setImageUrl(imageUrl);
											setLoading(false);
										});
									}
								}}
							>
								{imageUrl ? (
									<img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
								) : (
									<div>
										<Icon type={loading === 'flyer_upload' ? 'loading' : 'plus'} />
										<div className="ant-upload-text">Upload</div>
									</div>
								)}
							</Upload>
						</Row>

						<Row>
							<h4>Exclude or Include Certain Dates (Optional)</h4>
							<p>
								Select dates you want to include or exclude, such as Hoildays that you might be closed
								or open.
							</p>
							<div className="flex __column __gap">
								{excIncDates.map((item, i) => (
									<div key={i} className="flex __row __middle __gap">
										<Select value="exclude" size="large" style={{ width: '160px', height: '60px' }}>
											<Option value="exclude">Exclude</Option>
											<Option value="include">Include</Option>
										</Select>
										<DatePicker data-index={i} value={item.date} onChange={(val, valString)=>{
											console.log("excIncDate", val, valString);
											setExcIncDates([
												...excIncDates.slice(0, i),
												{exclude: false, date: val},
												...excIncDates.slice(i + 1)
											])
										}}/>
										{i == excIncDates.length - 1 ? (
											<Button
												size="large"
												type="link"
												onClick={() => {
													setExcIncDates([
														...excIncDates,
														{ exclude: false, date: null }
													]);
												}}
											>
												<Icon type="plus" /> add more
											</Button>
										) : (
											<Button
												size="large"
												type="link"
												onClick={(e) => {
													setExcIncDates([
														...excIncDates.slice(0, i),
														...excIncDates.slice(i + 1)
													]);
												}}
											>
												<Icon type="minus" /> remove
											</Button>
										)}
										{(i == excIncDates.length - 1 && item.date !== null) && (
											<Button
												size="large"
												type="link"
												onClick={() => {
													console.log("clear to be")
												}}
											>
												<Icon type="delete" /> clear
											</Button>
										)}
									</div>
								))}
							</div>
						</Row>
					</Card>
				</Row>

				<Row>
					<Card>
						<h3 className="__card-title">
							<Icon type="environment" /> Your Service Location
						</h3>
						<h4>Enter Location Address</h4>
						<p>
							Where is your service located? Your message will be sent to individuals within a 10
							kilometer of that service location.
						</p>
						<Row>
							<Col sm={18}>
								<Input
									size="large"
									placeholder="Address"
									value={
										geoFeatureData && geoFeatureData.features.length ? (
											geoFeatureData.features[0].place_name
										) : (
											address
										)
									}
									onChange={(e) => {
										e.preventDefault();
										setGeoFeatureData(null);
										setAddress(e.target.value);
									}}
								/>
							</Col>
							<Col sm={6}>
								<Button
									size="large"
									icon={loading == 'get_my_location' ? `loading` : `environment`}
									style={{ width: '100%' }}
									type={usingMyLocation ? 'primary' : 'default'}
									onClick={async () => {
										setLoading('get_my_location');
										async function fetchLocation() {
											return await getWebLocation();
										}

										await fetchLocation()
											.then(async (result) => {
												console.log('My corrdinates', result);
												if (result) {
													setMyCoordinates({
														lat: result.lat,
														long: result.long
													});
													setUsingMyLocation(true);
													let fetchedGeoFeatures = await getGeoFeature(
														result.long,
														result.lat
													);
													setGeoFeatureData(fetchedGeoFeatures);
												}
											})
											.catch((e) => {
												notification.open({
													key: 'location-service-blocked',
													message: 'Location Service Blocked',
													description: `Please enable your browser's location service to retreive your current location automatically.`,
													icon: <Icon type="warning" style={{ color: '#red' }} />,
													duration: 0,
													btn: (
														<Button
															size="large"
															type="link"
															onClick={() => {
																notification.close('location-service-blocked');
															}}
														>
															Close
														</Button>
													)
												});
												console.log('caught error');
											});
										setLoading(false);
									}}
								>
									{usingMyLocation ? 'Using Your' : 'Use My'} Location
								</Button>
							</Col>
						</Row>
						<Row>
							<Map
								myCoordinates={myCoordinates}
								setCoordinates={setMyCoordinates}
								usingMyLocation={usingMyLocation}
								setUsingMyLocation={setUsingMyLocation}
								parentGeoFeatureData={geoFeatureData}
								setParentGeoFeatureData={setGeoFeatureData}
							/>
						</Row>
					</Card>
				</Row>

				<Row>
					<Card>
						<h3 className="__card-title">
							<Icon type="message" /> Your Message
						</h3>
						<Row>
							<h4>Compose your message</h4>
							<p>
								Your message should contain the What, When, Where, Eligibility Requirements, and contact
								information of your available service.
							</p>
							<TextArea
								autosize={{ minRows: 6, maxRows: 8 }}
								onChange={(e) => {
									console.log(e.target.value);
									setMessageCharCount(e.target.value.length);
								}}
							/>
							<p className={`char-counter ${messageCharCount > settings.messageLimit ? '__full' : ''}`}>
								Characters left: {settings.messageLimit - messageCharCount}
							</p>
						</Row>
						<Row>
							<h4>Select the time to send the message</h4>
							<p>
								When do you want to send the messages? We recommand sending your message 3 days before
								the service date. You can send messages for recurring services.
							</p>
							<Radio.Group
								className="__flex"
								onChange={(e) => {
									setMessageSendTime(e.target.value);
									console.log('values', e.target.value);
								}}
								value={messageSendTime}
							>
								<Radio value={1}>2 Days Before</Radio>
								<Radio value={2}>24 Hours Before</Radio>
								<Radio value={3}>2 Hours Before</Radio>
								<Radio value={4}>Gov Special</Radio>
							</Radio.Group>
						</Row>
					</Card>
				</Row>

				<Row>
					<Card>
						<h3 className="__card-title">
							<Icon type="check-circle" /> Your Targeted Options
						</h3>

						<Row>
							<h4>Service / Event Categories</h4>
							<p>Select all that apply to your message above.</p>
							<CheckboxGroup
								className={`__flex`}
								options={categoriesOptions}
								onChange={(values) => {
									console.log('current values', values);
								}}
							/>
						</Row>

						<Row>
							<h4>Demographic Categories</h4>
							<p>Select all that apply.</p>
							<CheckboxGroup
								className={`__flex`}
								options={demographicOptions}
								onChange={(values) => {
									console.log('current values', values);
								}}
							/>
						</Row>

						<Row>
							<h4>Housing Status Served</h4>
							<p>Select all that apply.</p>
							<CheckboxGroup
								className={`__flex`}
								options={housingStatusOptions}
								onChange={(values) => {
									console.log('current values', values);
								}}
							/>
						</Row>
					</Card>
				</Row>

				<Row>
					<Card>
						<Row>
							<h3 className="__card-title">
								<Icon type="carry-out" /> Ready?
							</h3>
							<h4>Ready to post your service?</h4>
							<p>
								Please save and preview first, double check and make sure all information entered above
								are correct before proceeding to post.
							</p>
							{/* <Button
								icon="check-circle"
								size="large"
								type="primary"
								style={{ marginRight: '15px' }}
								htmlType="submit"
							>
								Post this service now
							</Button> */}
							<Button
								icon="save"
								type="primary"
								size="large"
								style={{ marginRight: '15px' }}
								htmlType="submit"
							>
								Save and preview
							</Button>
						</Row>
					</Card>
				</Row>
			</Form>
		</Layout>
	);
};

function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

function beforeUpload(file) {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
}

const CreatePost = Form.create({ name: 'create_post' })(CreatePostForm);

export default CreatePost;
