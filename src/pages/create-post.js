import React, { useState } from 'react';
import { Link } from 'gatsby';
import { useStaticQuery, graphql } from 'gatsby';
import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';
import { Select, Checkbox, DatePicker, TimePicker, Input, Radio, Button, Card, Row, Col, Icon } from 'antd';
import DateRange from '../components/form-components/date-picker';
import Map from '../components/form-components/map';

const settings = {
	messageLimit: 300
};
const CheckboxGroup = Checkbox.Group;
const TextArea = Input.TextArea;
const { Option } = Select;

const CreatePost = (props) => {
	let [ messageCharCount, setMessageCharCount ] = useState(0);
	let [ serviceRecurring, setServiceRecurring ] = useState(false);
	let [ serviceRecurringEvery, setServiceRecurringEvery ] = useState('every week');
	let [ messageSendTime, setMessageSendTime ] = useState(1);

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
						<Input size="large" placeholder="Example: Free lunch served" />
					</Row>
					<Row>
						<h4>Select your service type</h4>
						<Radio.Group
							className="__flex"
							onChange={(e) => {
								setServiceRecurring(e.target.value);
								console.log('values', e.target.value);
							}}
							value={serviceRecurring}
						>
							<Radio value={false}>One Time</Radio>
							<Radio value={true}>Recurring</Radio>
						</Radio.Group>
					</Row>
					<Row>
						<Col xs={24} md={8}>
							{!serviceRecurring && <h4>Service date</h4>}
							{serviceRecurring && <h4>Service starts on</h4>}
							<DatePicker
								format={dateFormat}
								onChange={(date, dateString) => {
									console.log('service date', date, dateString);
								}}
							/>
						</Col>
						<Col xs={24} md={8}>
							<h4>Start time</h4>
							<TimePicker
								use12Hours
								format="h:mm a"
								onChange={(time, timeString) => {
									console.log('time changed', time);
								}}
								placeholder="Select start time"
							/>
						</Col>
						<Col xs={24} md={8}>
							<h4>End time</h4>
							<TimePicker
								use12Hours
								format="h:mm a"
								onChange={(time, timeString) => {
									console.log('time changed', time);
								}}
								placeholder="Select end time"
							/>
						</Col>
					</Row>
					{serviceRecurring && (
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
											defaultValue={[1]}
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
									{(serviceRecurringEvery == 'every month' || serviceRecurringEvery == 'every year') && (
										<Select
											mode="multiple"
											size="large"
											defaultValue={[1]}
											style={{ minWidth: '150px', width: 'auto', marginRight: '8px' }}
										>
											<Option value={1}>First</Option>
											<Option value={2}>Second</Option>
											<Option value={3}>Third</Option>
											<Option value={4}>Last</Option>
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
					{serviceRecurring && (
						<Row>
							<Col xs={24} md={8}>
								<h4>Service stops on</h4>
								<DatePicker
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
				</Card>
			</Row>

			<Row>
				<Card>
					<h3 className="__card-title">
						<Icon type="environment" /> Your Service Location
					</h3>
					<h4>Enter Location Address</h4>
					<p>
						Where is your service located? Your message will be sent to individuals within a 10 kilometer of
						that service location.
					</p>
					<Row>
						<Col sm={18}>
							<Input size="large" placeholder="Address" />
						</Col>
						<Col sm={6}>
							<Button size="large" icon="environment" style={{ width: '100%' }}>
								Use My Location
							</Button>
						</Col>
					</Row>
					<Row>
						<Map />
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
							When do you want to send the messages? We recommand sending your message 3 days before the
							service date. You can send messages for recurring services.
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
						<h4>Ready to start your service?</h4>
						<p>
							Please double check and make sure all information entered above are correct before
							proceeding to start.
						</p>
						<Button icon="check-circle" size="large" type="primary" style={{ marginRight: '15px' }}>
							Start this service now
						</Button>
						<Button icon="save" size="large">
							Save and preview
						</Button>
					</Row>
				</Card>
			</Row>
		</Layout>
	);
};

export default CreatePost;