<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0" xmlns:xalan="http://xml.apache.org/xslt">

<xsl:output indent="yes" method="html"/>


	<xsl:template match="contacts">
		<table>
			<tr>
			<td class='theader'>Full Name</td>
			<td class='theader'>First Name</td>
			<td class='theader'>Last Name</td>
			<td class='theader'>Middle Initial</td>
			<td class='theader'>Email Address</td>
			<td class='theader'>Phone Number</td>
			</tr>

			<xsl:apply-templates select="person" />

		</table>


	</xsl:template>

	<xsl:template match="person">
		<tr>
			<td>
				<xsl:apply-templates select="fullname" />
			</td>
			<td>
				<xsl:apply-templates select="fname" />
			</td>
			<td>
				<xsl:apply-templates select="lname" />
			</td>
			<td>
				<xsl:apply-templates select="mi" />
			</td>
			<td>
				<xsl:apply-templates select="emailaddress" />
			</td>
			<td>
				<xsl:apply-templates select="phonenumber" />
			</td>
		</tr>
	</xsl:template>

	<xsl:template match="fullname">
		<xsl:value-of select="." />
	</xsl:template>
	<xsl:template match="fname">
		<xsl:value-of select="." />
	</xsl:template>
	<xsl:template match="lname">
		<xsl:value-of select="." />
	</xsl:template>
	<xsl:template match="mi">
		<xsl:value-of select="." />
	</xsl:template>
	<xsl:template match="emailaddress">
		<xsl:value-of select="." />
	</xsl:template>	
	<xsl:template match="phonenumber">
		<xsl:value-of select="." />
	</xsl:template>

</xsl:stylesheet>



